"use client";
import * as React from 'react';
import { Grid, TextField, Button, CircularProgress } from "@mui/material";

import { config } from '@/config';
import { Budget } from '@/components/dashboard/overview/budget';
import { LatestOrders } from '@/components/dashboard/overview/latest-orders';
import { TotalCustomers } from '@/components/dashboard/overview/total-customers';
import DashboardContent from "@/components/dashboard/dashboard-content";
import EventBus from '@/util/event-bus';

export default function Page(): React.JSX.Element {
  const [passengerDataByStation, setPassengerDataByStation] = React.useState<any>(null);
  const [stationPassengerCountMap, setStationPassengerCountMap] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(false);
  const [graphLoading, setGraphLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [selectedStation, setSelectedStation] = React.useState(0);
  const [timestampLatest, setTimestampLatest] = React.useState<Date | null>(null);
  const [timestampPrevious, setTimestampPrevious] = React.useState<Date | null>(null);
  const [maxPassengerCountThreshold, setMaxPassengerCountThreshold] = React.useState<number | null>(null);
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(new Date());
  const [dateChangedFromNotification, setDateChangedFromNotification] = React.useState(false);

  const stations = [
    "Recto", "Legarda", "Pureza", "V. Mapa", "J. Ruiz",
    "Gilmore", "Betty-Go Belmonte", "Araneta Cubao", "Anonas",
    "Katipunan", "Santolan", "Marikina-Pasig", "Antipolo"
  ];

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
  };

  const fetchPassengerData = async (withDate: boolean = false) => {
    setLoading(true);
    setGraphLoading(true);
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      let url = 'http://localhost:7001/trainos-admin/report/getOverviewData';
      if (withDate && selectedDate) {
        const formattedDate = selectedDate.toLocaleDateString('en-CA');
        url += `?searchDate=${formattedDate}`;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'userId': userId || "",
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const data = await response.json();
      setPassengerDataByStation(data.data.passengerDataByStation);
      setStationPassengerCountMap(data.data.stationPassengerCountMap);
      setTimestampLatest(formatDate(new Date(data.data.datePredictedLatest)));
      setTimestampPrevious(formatDate(new Date(data.data.datePredictedPrevious)));
      setMaxPassengerCountThreshold(data.data.maxPassengerCountThreshold);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
      setGraphLoading(false);
    }
  };

  React.useEffect(() => {
    fetchPassengerData();
  }, []);

  React.useEffect(() => {
    if (dateChangedFromNotification && selectedDate) {
      fetchPassengerData(true);
      setDateChangedFromNotification(false); // reset flag
    }
  }, [selectedDate, dateChangedFromNotification]);

  React.useEffect(() => {
    const handleStationChange = (stationIndex: number) => {
      setSelectedStation(stationIndex);
    };

    const handleNotificationClick = ({ date }: { date: Date }) => {
      setSelectedDate(date);
      setDateChangedFromNotification(true);
    };

    EventBus.on("stationChange", handleStationChange);
    EventBus.on("notificationClicked", handleNotificationClick);

    return () => {
      EventBus.off("stationChange", handleStationChange);
      EventBus.off("notificationClicked", handleNotificationClick);
    };
  }, []);

  // Reload every 1 minute if passengerDataByStation is still {}
  React.useEffect(() => {
    const interval = setInterval(() => {
      if (passengerDataByStation && Object.keys(passengerDataByStation).length === 0) {
        fetchPassengerData();
      }
    }, 60000); // 60000 ms = 1 minute

    return () => clearInterval(interval);
  }, [passengerDataByStation]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Grid container spacing={3}>
      {/* DATE & SEARCH */}
      <Grid item xs={12} container spacing={2} alignItems="center">
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Select Date"
            type="date"
            value={selectedDate ? selectedDate.toLocaleDateString('en-CA') : ''}
            onChange={(e) => setSelectedDate(new Date(e.target.value))}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} md="auto">
          <Button
            variant="contained"
            onClick={() => fetchPassengerData(true)}
            sx={{ height: '100%', minWidth: 120 }}
          >
            Search
          </Button>
        </Grid>
      </Grid>

      {/* GRAPH ON TOP */}
      <Grid item lg={12} xs={12}>
        {graphLoading || passengerDataByStation === null || Object.keys(passengerDataByStation).length === 0 ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
            <CircularProgress />
          </div>
        ) : (
          <DashboardContent 
            passengerDataByStation={passengerDataByStation} 
            selectedStation={selectedStation} 
            setSelectedStation={setSelectedStation}
            stations={stations}
            timestampLatest={timestampLatest}
            timestampPrevious={timestampPrevious}
          />
        )}
      </Grid>

      {/* TWO-PANE LAYOUT */}
      <Grid item container spacing={3} lg={12} xs={12}>
        <Grid item lg={6} xs={12}>
          <LatestOrders 
            selectedStation={selectedStation} 
            stations={stations}
            timestampLatest={timestampLatest}
            orders={
              passengerDataByStation?.[stations[selectedStation]] 
                ? passengerDataByStation[stations[selectedStation]]
                    .filter(entry => entry.predictedDataToday > maxPassengerCountThreshold)
                    .map(({ time, predictedDataToday }) => ({ time, predictedDataToday }))
                : []
            }
          />
        </Grid>
        <Grid item lg={6} xs={12} container spacing={3} direction="column">
          <Grid item>
            <Budget 
              diff={stationPassengerCountMap?.HIGHEST_PASSENGER_COUNT?.totalPassengerCount || 0} 
              trend="up" 
              sx={{ height: '100%' }} 
              value={(stationPassengerCountMap?.HIGHEST_PASSENGER_COUNT?.station || "") + " Station"} 
            />
          </Grid>
          <Grid item>
            <TotalCustomers 
              diff={stationPassengerCountMap?.HIGHEST_PASSENGER_COUNT_AM?.totalPassengerCount || 0} 
              trend="down" 
              sx={{ height: '100%' }} 
              value={(stationPassengerCountMap?.HIGHEST_PASSENGER_COUNT_AM?.station || "") + " Station"} 
              peak="7-9 AM"
            />
          </Grid>
          <Grid item>
            <TotalCustomers 
              diff={stationPassengerCountMap?.HIGHEST_PASSENGER_COUNT_PM?.totalPassengerCount || 0} 
              trend="down" 
              sx={{ height: '100%' }} 
              value={(stationPassengerCountMap?.HIGHEST_PASSENGER_COUNT_PM?.station || "") + " Station"} 
              peak="5-7 PM"
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
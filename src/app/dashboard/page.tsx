"use client";
import * as React from 'react';
import { Grid } from "@mui/material";

import { config } from '@/config';
import { Budget } from '@/components/dashboard/overview/budget';
import { LatestOrders } from '@/components/dashboard/overview/latest-orders';
import { TotalCustomers } from '@/components/dashboard/overview/total-customers';
import DashboardContent from "@/components/dashboard/dashboard-content";

export default function Page(): React.JSX.Element {
  const [passengerDataByStation, setPassengerDataByStation] = React.useState<any>(null);
  const [stationPassengerCountMap, setStationPassengerCountMap] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [selectedStation, setSelectedStation] = React.useState(0);
  const [timestampLatest, setTimestampLatest] = React.useState<Date | null>(null);
  const [timestampPrevious, setTimestampPrevious] = React.useState<Date | null>(null);
  const [maxPassengerCountThreshold, setMaxPassengerCountThreshold] = React.useState<number | null>(null);
  
  const stations = [
    "Recto", "Legarda", "Pureza", "V. Mapa", "J. Ruiz",
    "Gilmore", "Betty-Go Belmonte", "Araneta Cubao", "Anonas",
    "Katipunan", "Santolan", "Marikina-Pasig", "Antipolo"
  ];

  const formatDate = (date: Date) => {
  	return date.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
  };

  React.useEffect(() => {
    const fetchPassengerData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');

        const response = await fetch('http://localhost:7001/trainos-admin/report/getOverviewData', {
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
      }
    };

    fetchPassengerData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Grid container spacing={3}>
      
      {/* GRAPH ON TOP */}
      <Grid item lg={12} xs={12}>
        <DashboardContent 
          passengerDataByStation={passengerDataByStation} 
          selectedStation={selectedStation} 
          setSelectedStation={setSelectedStation}
          stations={stations}
		  timestampLatest={timestampLatest}
		  timestampPrevious={timestampPrevious}
        />
      </Grid>

      {/* TWO-PANE LAYOUT */}
      <Grid item container spacing={3} lg={12} xs={12}>

        {/* LEFT PANE: LATEST ORDERS (50% WIDTH) */}
        <Grid item lg={6} xs={12}>
          <LatestOrders 
            selectedStation={selectedStation} 
            stations={stations}
			timestampLatest={timestampLatest}
            orders={
              passengerDataByStation?.[stations[selectedStation]] 
                ? passengerDataByStation[stations[selectedStation]]
                    .filter(entry => entry.predictedDataToday > maxPassengerCountThreshold) // Adjust threshold if needed
                    .map(({ time, predictedDataToday }) => ({ time, predictedDataToday }))
                : [] // Ensure it falls back to an empty array
            }
          />
        </Grid>

        {/* RIGHT PANE: THREE STAT CARDS (50% WIDTH, STACKED VERTICALLY) */}
        <Grid item lg={6} xs={12} container spacing={3} direction="column">
          <Grid item>
            <Budget 
              diff={stationPassengerCountMap?.HIGHEST_PASSENGER_COUNT?.totalPassengerCount || 0} 
              trend="up" 
              sx={{ height: '100%' }} 
              value={stationPassengerCountMap?.HIGHEST_PASSENGER_COUNT?.station || "" + " Station"} 
            />
          </Grid>
          <Grid item>
            <TotalCustomers 
              diff={stationPassengerCountMap?.HIGHEST_PASSENGER_COUNT_AM?.totalPassengerCount || 0} 
              trend="down" 
              sx={{ height: '100%' }} 
              value={stationPassengerCountMap?.HIGHEST_PASSENGER_COUNT_AM?.station || "" + " Station"} 
              peak="7-9 AM"
            />
          </Grid>
          <Grid item>
            <TotalCustomers 
              diff={stationPassengerCountMap?.HIGHEST_PASSENGER_COUNT_PM?.totalPassengerCount || 0} 
              trend="down" 
              sx={{ height: '100%' }} 
              value={stationPassengerCountMap?.HIGHEST_PASSENGER_COUNT_PM?.station || "" + " Station"} 
              peak="5-7 PM"
            />
          </Grid>
        </Grid>

      </Grid>

    </Grid>
  );
}
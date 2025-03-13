"use client";

import * as React from "react";
import Grid from "@mui/material/Unstable_Grid2";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid, 
  Legend 
} from "recharts";

const stations = [
  "Recto",
  "Legarda",
  "Pureza",
  "V. Mapa",
  "J. Ruiz",
  "Gilmore",
  "Betty-Go Belmonte",
  "Araneta Cubao",
  "Anonas",
  "Katipunan",
  "Santolan",
  "Marikina-Pasig",
  "Antipolo",
];

const passengerDataByStation = {
  "Recto": [
    { time: "04:00-05:00", predictedDataYesterday: 50, actualDataYesterday: 60, predictedDataToday: 55 },
    { time: "05:00-06:00", predictedDataYesterday: 300, actualDataYesterday: 310, predictedDataToday: 320 },
    { time: "06:00-07:00", predictedDataYesterday: 700, actualDataYesterday: 780, predictedDataToday: 750 },
    { time: "07:00-08:00", predictedDataYesterday: 950, actualDataYesterday: 1200, predictedDataToday: 1100 },
    { time: "08:00-09:00", predictedDataYesterday: 1000, actualDataYesterday: 980, predictedDataToday: 1020 },
    { time: "09:00-10:00", predictedDataYesterday: 1100, actualDataYesterday: 800, predictedDataToday: 1120 },
{ time: "09:00-10:00", predictedDataYesterday: 1100, actualDataYesterday: 800, predictedDataToday: 1120 },
{ time: "09:00-10:00", predictedDataYesterday: 1100, actualDataYesterday: 800, predictedDataToday: 1120 },
{ time: "09:00-10:00", predictedDataYesterday: 1100, actualDataYesterday: 800, predictedDataToday: 1120 },
{ time: "09:00-10:00", predictedDataYesterday: 1100, actualDataYesterday: 800, predictedDataToday: 1120 },
{ time: "09:00-10:00", predictedDataYesterday: 1100, actualDataYesterday: 800, predictedDataToday: 1120 },
{ time: "09:00-10:00", predictedDataYesterday: 1100, actualDataYesterday: 800, predictedDataToday: 1120 },
{ time: "09:00-10:00", predictedDataYesterday: 1100, actualDataYesterday: 800, predictedDataToday: 1120 },
{ time: "09:00-10:00", predictedDataYesterday: 1100, actualDataYesterday: 800, predictedDataToday: 1120 },
{ time: "09:00-10:00", predictedDataYesterday: 1100, actualDataYesterday: 800, predictedDataToday: 1120 },
{ time: "09:00-10:00", predictedDataYesterday: 1100, actualDataYesterday: 800, predictedDataToday: 1120 },
{ time: "09:00-10:00", predictedDataYesterday: 1100, actualDataYesterday: 800, predictedDataToday: 1120 },
{ time: "09:00-10:00", predictedDataYesterday: 1100, actualDataYesterday: 800, predictedDataToday: 1120 },
{ time: "09:00-10:00", predictedDataYesterday: 0, actualDataYesterday: 0, predictedDataToday: 0 },
{ time: "09:00-10:00", predictedDataYesterday: 0, actualDataYesterday: 0, predictedDataToday: 0 },
  ],
  "Legarda": [
    { time: "04:00-05:00", predictedDataYesterday: 40, actualDataYesterday: 50, predictedDataToday: 45 },
    { time: "05:00-06:00", predictedDataYesterday: 290, actualDataYesterday: 300, predictedDataToday: 310 },
    { time: "06:00-07:00", predictedDataYesterday: 690, actualDataYesterday: 800, predictedDataToday: 720 },
    { time: "07:00-08:00", predictedDataYesterday: 920, actualDataYesterday: 1180, predictedDataToday: 1080 },
    { time: "08:00-09:00", predictedDataYesterday: 970, actualDataYesterday: 960, predictedDataToday: 990 },
    { time: "09:00-10:00", predictedDataYesterday: 1070, actualDataYesterday: 810, predictedDataToday: 1090 },
{ time: "09:00-10:00", predictedDataYesterday: 1100, actualDataYesterday: 800, predictedDataToday: 1120 },
{ time: "09:00-10:00", predictedDataYesterday: 1100, actualDataYesterday: 800, predictedDataToday: 1120 },
{ time: "09:00-10:00", predictedDataYesterday: 1100, actualDataYesterday: 800, predictedDataToday: 1120 },
{ time: "09:00-10:00", predictedDataYesterday: 1100, actualDataYesterday: 800, predictedDataToday: 1120 },
{ time: "09:00-10:00", predictedDataYesterday: 1100, actualDataYesterday: 800, predictedDataToday: 1120 },
{ time: "09:00-10:00", predictedDataYesterday: 1100, actualDataYesterday: 800, predictedDataToday: 1120 },
{ time: "09:00-10:00", predictedDataYesterday: 1100, actualDataYesterday: 800, predictedDataToday: 1120 },
{ time: "09:00-10:00", predictedDataYesterday: 1100, actualDataYesterday: 800, predictedDataToday: 1120 },
{ time: "09:00-10:00", predictedDataYesterday: 1100, actualDataYesterday: 800, predictedDataToday: 1120 },
{ time: "09:00-10:00", predictedDataYesterday: 1100, actualDataYesterday: 800, predictedDataToday: 1120 },
{ time: "09:00-10:00", predictedDataYesterday: 1100, actualDataYesterday: 800, predictedDataToday: 1120 },
{ time: "09:00-10:00", predictedDataYesterday: 1100, actualDataYesterday: 800, predictedDataToday: 1120 },
{ time: "09:00-10:00", predictedDataYesterday: 0, actualDataYesterday: 0, predictedDataToday: 0 },
{ time: "09:00-10:00", predictedDataYesterday: 0, actualDataYesterday: 0, predictedDataToday: 0 },
  ],
};

interface PageProps {
  passengerDataByStation: { [key: string]: any };
  stationPassengerCountMap: { [key: string]: any };
}

export default function DashboardContent({
	passengerDataByStation,
	stationPassengerCountMap,
} : PageProps): React.JSX.Element {
  const [selectedStation, setSelectedStation] = React.useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setSelectedStation(newValue);
  };

  return (
    <Grid container spacing={3} sx={{ minHeight: "400px", flexGrow: 1, width: "100%" }}>
      <Grid item xs={12}>
        <Tabs
          value={selectedStation}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          {stations.map((station, index) => (
            <Tab key={index} label={station} />
          ))}
        </Tabs>
      </Grid>
      <Grid item xs={12} sx={{ width: "100%" }}>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={passengerDataByStation?.[stations?.[selectedStation]] || []}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
           	<YAxis domain={[0, 'auto']} allowDataOverflow />
            <Tooltip />
            <Legend />
            <Bar dataKey="actualDataYesterday" fill="#8884d8" name="Actual Data Yesterday" />
            <Bar dataKey="predictedDataYesterday" fill="#82ca9d" name="Predicted Data Yesterday" />
            <Bar dataKey="predictedDataToday" fill="#ff7300" name="Predicted Data Today" />
          </BarChart>
        </ResponsiveContainer>
      </Grid>
    </Grid>
  );
}
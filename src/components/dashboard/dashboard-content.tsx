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
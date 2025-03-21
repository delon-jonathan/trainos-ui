'use client';

import * as React from 'react';
import Card from '@mui/material/Card';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { CustomersTable } from './customers-table';

export function CustomersFilters(): React.JSX.Element {
  const today = new Date().toISOString().split('T')[0];
  const [searchType, setSearchType] = React.useState('DATE');
  const [startDate, setStartDate] = React.useState(today);
  const [endDate, setEndDate] = React.useState(today);
  const [tableData, setTableData] = React.useState<{ id: string }[]>([]);
  const [dailyPassengerData, setDailyPassengerData] = React.useState<{ [key: string]: any }>({});
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(20);
  const isSpecificDay = searchType === 'SPECIFIC_DAY';
  const isSearchDisabled = !isSpecificDay && endDate < startDate;

  const handleSearch = async () => {
	 const token = localStorage.getItem('token');
	 const userId = localStorage.getItem('userId');
	
	  const queryParams = new URLSearchParams({
	    startDate,
	    endDate: isSpecificDay ? startDate : endDate,
	    searchType: searchType,
	    pageNo: page.toString(),
	  });
	
	  try {
	    const response = await fetch(`http://localhost:7001/trainos-admin/report/search?${queryParams}`, {
	      method: 'GET',
	      headers: {
	        'Content-Type': 'application/json',
	        'Authorization': `Bearer ${token}`,
	        'userId': userId,
	      },
	    });
		console.log(startDate+" "+isSpecificDay+" "+searchType +" "+endDate+" "+page.toString());
	    if (!response.ok) {
	      throw new Error(`Error: ${response.statusText}`);
	    }
	
	    const data = await response.json();
		console.log(data);
	    setDailyPassengerData(data.data);
	  } catch (error) {
	    console.error('Search failed:', error);
	  }
  };

  return (
    <Card sx={{ p: 2 }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Search By</InputLabel>
          <Select
			  value={searchType}
			  onChange={(event) => {
			    const newValue = event.target.value; // Directly use the selected value
			    setSearchType(newValue);
			    
			    if (newValue === 'SPECIFIC_DAY') {
			      setEndDate(''); // Reset end date if SPECIFIC_DAY is selected
			    } else {
			      setEndDate(today); // Reset end date when switching back to DATE
			    }
			  }}
			  label="Search By"
			>
			  <MenuItem value="DATE">Date</MenuItem>
			  <MenuItem value="SPECIFIC_DAY">Specific Day</MenuItem>
			</Select>
        </FormControl>

        <TextField
          label="Start Date"
          type="date"
          value={startDate}
          onChange={(event) => setStartDate(event.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{ minWidth: 200 }}
        />

        <TextField
          label="End Date"
          type="date"
          value={endDate}
          onChange={(event) => setEndDate(event.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{ minWidth: 200 }}
          disabled={isSpecificDay}
        />

        <Button variant="contained" onClick={handleSearch} sx={{ minWidth: 120 }} disabled={isSearchDisabled}>
          Search
        </Button>
      </Stack>
      <Divider sx={{ my: 2 }} />
      <CustomersTable
		  count={tableData.length}
		  dailyPassengerData={dailyPassengerData}
		  setDailyPassengerData={setDailyPassengerData}
		  setPage={setPage}
		  page={page}
		  rowsPerPage={rowsPerPage}
		  startDate={startDate} // Pass startDate
		  endDate={endDate}     // Pass endDate
		  searchType={searchType} // Pass searchType
	      isSpecificDay={isSpecificDay}
		/>
    </Card>
  );
}

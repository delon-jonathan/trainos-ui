'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

import { useSelection } from '@/hooks/use-selection';

function noop(): void {
  // do nothing
}

export interface Customer {
  id: string;
}

interface CustomersTableProps {
  count?: number;
  setPage: (value: number) => void;
  page?: number;
  rows?: Customer[];
  dailyPassengerData: { [key: string]: any };
  rowsPerPage?: number;
  startDate?: string;  // New prop
  endDate?: string;    // New prop
  searchType?: string; // New prop
}

export function CustomersTable({
  count = 0,
  rows = [],
  page = 1,
  dailyPassengerData,
  setDailyPassengerData,
  setPage,
  rowsPerPage = 0,
  startDate,
  endDate,
  searchType,
  isSpecificDay,
}: CustomersTableProps): React.JSX.Element {
  const rowIds = React.useMemo(() => rows.map((customer) => customer.id), [rows]);

  const timeIntervals = Array.from({ length: 20 }, (_, i) => {
    const hour = 4 + i; // Start from 4 AM
    const startTime = `${hour.toString().padStart(2, '0')}:00`;
    const endTime = `${hour === 23 ? '23:59' : `${(hour + 1).toString().padStart(2, '0')}:00`}`;
    return `${startTime} - ${endTime}`;
  });

  const fixedRows = [...rows, ...Array(Math.max(0, 20 - rows.length)).fill(null)];
  const stations = [
    'Recto',
    'Legarda',
    'Pureza',
    'V. Mapa',
    'J. Ruiz',
    'Gilmore',
    'Betty-Go Belmonte',
    'Araneta Cubao',
    'Anonas',
    'Katipunan',
    'Santolan',
    'Marikina-Pasig',
    'Antipolo',
  ];

  	const getPassengerFlow = (station: string, startTime: number, endTime: number, interval: number) => {
	    const stationDataArray = dailyPassengerData?.dailyPassenger?.passengerFlowData;
	    if (!Array.isArray(stationDataArray)) return { entryCount: 0, exitCount: 0 };
	
	    const stationObj = stationDataArray.find(item => item.station === station);
	    if (!stationObj || !Array.isArray(stationObj.passengerCountList)) return { entryCount: 0, exitCount: 0 };
		if(stationObj.passengerCountList.length == 0){
			return { entryCount : 0, exitCount: 0};
		}
		if(stationObj.passengerCountList.length > 20){
			return { entryCount : stationObj.passengerCountList[interval + 20].entryCount, exitCount: stationObj.passengerCountList[interval + 20].exitCount};
		}
		return { entryCount : stationObj.passengerCountList[interval].entryCount, exitCount: stationObj.passengerCountList[interval].exitCount};
	};
	
  const handlePageChange = (_event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
	  page = newPage;
	  console.log(page);
      setPage(newPage);
      handleSearch(newPage);
  };

  const handleSearch = async (pageNo: number) => {
	 const token = localStorage.getItem('token');
	 const userId = localStorage.getItem('userId');
	
	  const queryParams = new URLSearchParams({
	    startDate,
	    endDate: isSpecificDay ? startDate : endDate,
	    searchType: searchType,
	    pageNo: pageNo.toString(),
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
    <Card>
      <Box sx={{ overflowX: 'auto', minWidth: '1400px' }}>
        <Table>
		  {/* First Header Row: Station Names */}
		  <TableHead>
		    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
		      <TableCell rowSpan={2} sx={{ fontWeight: 'bold', textAlign: 'center', whiteSpace: 'nowrap' }}>
		        Station Time
		      </TableCell>
		      {(() => {
		        const headerCells = [];
		        for (let i = 0; i < stations.length; i++) {
		          headerCells.push(
		            <TableCell key={i} colSpan={2} sx={{ fontWeight: 'bold', textAlign: 'center' }}>
		              {stations[i]}
		            </TableCell>
		          );
		        }
		        return headerCells;
		      })()}
		      <TableCell
		        rowSpan={2}
		        sx={{
		          fontWeight: 'bold',
		          textAlign: 'center',
		          position: 'sticky',
		          right: 0,
		          backgroundColor: '#f5f5f5',
		          zIndex: 1,
		          minWidth: 100, // Ensure the total column is wide enough
		        }}
		      >
		        Total
		      </TableCell>
		    </TableRow>
		    {/* Second Header Row: Entry and Exit */}
		    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
		      {(() => {
		        const entryExitCells = [];
		        for (let i = 0; i < stations.length; i++) {
		          entryExitCells.push(
		            <TableCell key={`entry-${i}`} sx={{ fontWeight: 'bold', textAlign: 'center' }}>
		              Entry
		            </TableCell>
		          );
		          entryExitCells.push(
		            <TableCell key={`exit-${i}`} sx={{ fontWeight: 'bold', textAlign: 'center' }}>
		              Exit
		            </TableCell>
		          );
		        }
		        return entryExitCells;
		      })()}
		    </TableRow>
		  </TableHead>
		
		  {/* Table Body */}
		  <TableBody>
		    {(() => {
		      const rows = [];
		      for (let index = 0; index < timeIntervals.length; index++) {
		        const timeInterval = timeIntervals[index];
		        const [startTime, endTime] = timeInterval.split(' - ').map((t) => {
		          const [hour, minute] = t.split(':').map(Number);
		          return new Date(2023, 0, 6, hour, minute).getTime(); // Convert time to timestamp
		        });
		
		        const rowCells = [];
		        rowCells.push(
		          <TableCell sx={{ whiteSpace: 'nowrap' }} key={`time-${index}`}>
		            {timeInterval}
		          </TableCell>
		        );
		
		        for (let i = 0; i < stations.length; i++) {
		          const { entryCount, exitCount } = getPassengerFlow(stations[i], startTime, endTime, index);
		          rowCells.push(
		            <TableCell key={`entry-${stations[i]}-${index}`} sx={{ textAlign: 'center' }}>
		              {entryCount}
		            </TableCell>
		          );
		          rowCells.push(
		            <TableCell key={`exit-${stations[i]}-${index}`} sx={{ textAlign: 'center' }}>
		              {exitCount}
		            </TableCell>
		          );
		        }
		
		        // Calculate Total for the time interval
		        let total = 0;
		        for (let i = 0; i < stations.length; i++) {
		          const { entryCount, exitCount } = getPassengerFlow(stations[i], startTime, endTime, index);
		          total += entryCount + exitCount;
		        }
		
		        rowCells.push(
		          <TableCell
		            key="total-column"
		            sx={{
		              textAlign: 'center',
		              position: 'sticky',
		              right: 0,
		              backgroundColor: 'inherit',
		              zIndex: 1,
		              minWidth: 100, // Ensure the total column is wide enough
		            }}
		          >
		            {total}
		          </TableCell>
		        );
		
		        rows.push(<TableRow key={index} sx={{ height: 50 }}>{rowCells}</TableRow>);
		      }
		      return rows;
		    })()}
		  </TableBody>
		</Table>
      </Box>
      <Divider />
      <TablePagination
        component="div"
        count={dailyPassengerData.totalRecord}
        onPageChange={handlePageChange}
        onRowsPerPageChange={noop}
        page={page}
        rowsPerPage={20} // Fixed 20 rows per page
        rowsPerPageOptions={[]} // Only allow 20 rows per page
      />
    </Card>
  );
}
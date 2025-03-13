"use client";
import * as React from 'react';
//import type { Metadata } from 'next';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import { Download as DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { Upload as UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';
import dayjs from 'dayjs';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import EditIcon from '@mui/icons-material/Edit';

import { config } from '@/config';
import { IntegrationCard } from '@/components/dashboard/integrations/integrations-card';
import type { Integration } from '@/components/dashboard/integrations/integrations-card';
import { CompaniesFilters } from '@/components/dashboard/integrations/integrations-filters';

//export const metadata = { title: `Integrations | Dashboard | ${config.site.name}` } satisfies Metadata;

// Dummy data for the table
/*const dummyData = [
  { id: 1, name: 'John Doe', username: 'johndoe', roleName: 'Admin', roleDescription: 'Desc 1' },
  { id: 2, name: 'Jane Smith', username: 'janesmith', roleName: 'Editor', roleDescription: 'Desc 1'},
  { id: 3, name: 'Emily Davis', username: 'emilydavis', roleName: 'Viewer', roleDescription: 'Desc 1' },
  { id: 4, name: 'Michael Brown', username: 'michaelbrown', roleName: 'Editor', roleDescription: 'Desc 1' },
];*/

const integrations = [
  {
    id: 'INTEG-006',
    title: 'Dropbox',
    description: 'Dropbox is a file hosting service that offers cloud storage, file synchronization, a personal cloud.',
    logo: '/assets/logo-dropbox.png',
    installs: 594,
    updatedAt: dayjs().subtract(12, 'minute').toDate(),
  },
  {
    id: 'INTEG-005',
    title: 'Medium Corporation',
    description: 'Medium is an online publishing platform developed by Evan Williams, and launched in August 2012.',
    logo: '/assets/logo-medium.png',
    installs: 625,
    updatedAt: dayjs().subtract(43, 'minute').subtract(1, 'hour').toDate(),
  },
  {
    id: 'INTEG-004',
    title: 'Slack',
    description: 'Slack is a cloud-based set of team collaboration tools and services, founded by Stewart Butterfield.',
    logo: '/assets/logo-slack.png',
    installs: 857,
    updatedAt: dayjs().subtract(50, 'minute').subtract(3, 'hour').toDate(),
  },
  {
    id: 'INTEG-003',
    title: 'Lyft',
    description: 'Lyft is an on-demand transportation company based in San Francisco, California.',
    logo: '/assets/logo-lyft.png',
    installs: 406,
    updatedAt: dayjs().subtract(7, 'minute').subtract(4, 'hour').subtract(1, 'day').toDate(),
  },
  {
    id: 'INTEG-002',
    title: 'GitHub',
    description: 'GitHub is a web-based hosting service for version control of code using Git.',
    logo: '/assets/logo-github.png',
    installs: 835,
    updatedAt: dayjs().subtract(31, 'minute').subtract(4, 'hour').subtract(5, 'day').toDate(),
  },
  {
    id: 'INTEG-001',
    title: 'Squarespace',
    description: 'Squarespace provides software as a service for website building and hosting. Headquartered in NYC.',
    logo: '/assets/logo-squarespace.png',
    installs: 435,
    updatedAt: dayjs().subtract(25, 'minute').subtract(6, 'hour').subtract(6, 'day').toDate(),
  },
] satisfies Integration[];

export default function Page(): React.JSX.Element {
  	
 const [searchResults, setSearchResults] = React.useState<any>(null);
 const [searchTypeUser, setSearchTypeUser] = React.useState<string | null>(null);
 const [searchParam, setSearchParam] = React.useState<string | null>(null);

 const handleSearch = async () => {
	const token = localStorage.getItem('token');
	const userId = localStorage.getItem('userId');
	
	const queryParams = new URLSearchParams({
	    searchTypeUser,
		searchParam,
	  });

    try {
	   let url = 'http://localhost:7001/trainos-admin/admin/searchUsers?${queryParams}';
	   if(searchTypeUser != null && searchParam != null){
	   	   url = 'http://localhost:7001/trainos-admin/admin/searchUsers';
	   }
       const response = await fetch(url , {
	      method: 'GET',
	      headers: {
	        'Content-Type': 'application/json',
	        'Authorization': `Bearer ${token}`,
	        'userId': userId,
	      },
	    });
		if (!response.ok) {
	      throw new Error(`Error: ${response.statusText}`);
	    }
	
	    const data = await response.json();
		console.log(data);
	    setSearchResults(data.data);
    } catch (error) {
      console.error("API call failed", error);
    }
  };	
	
  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Users</Typography>
          {/*<Stack sx={{ alignItems: 'center' }} direction="row" spacing={1}>
            <Button color="inherit" startIcon={<UploadIcon fontSize="var(--icon-fontSize-md)" />}>
              Import
            </Button>
            <Button color="inherit" startIcon={<DownloadIcon fontSize="var(--icon-fontSize-md)" />}>
              Export
            </Button>
          </Stack>*/}
        </Stack>
        <div>
          <Button startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />} variant="contained">
            Add
          </Button>
        </div>
      </Stack>
      <CompaniesFilters onSearch={handleSearch} searchResults={searchResults} searchTypeUser={searchTypeUser} searchParam={searchParam}/>
	  <TableContainer component={Paper}>
	      <Table>
	        <TableHead>
	          <TableRow>
	            <TableCell>Name</TableCell>
	            <TableCell>Username</TableCell>
	            <TableCell>Role</TableCell>
				<TableCell>Description</TableCell>
	            {/* The "Edit" column doesn't need a title */}
	            <TableCell />
	          </TableRow>
	        </TableHead>
	        <TableBody>
	          {searchResults?.map((user) => (
	            <TableRow key={user.id}>
	              <TableCell>{user.fullName}</TableCell>
	              <TableCell>{user.username}</TableCell>
	              <TableCell>{user.roleName}</TableCell>
				  <TableCell>{user.roleDescription}</TableCell>
	              {/* Edit column with a button */}
	              <TableCell>
	                <Button startIcon={<EditIcon />} size="small" color="primary">
	                  Edit
	                </Button>
	              </TableCell>
	            </TableRow>
	          ))}
	        </TableBody>
	      </Table>
      </TableContainer>
      {/*<Grid container spacing={3}>
        {integrations.map((integration) => (
          <Grid key={integration.id} lg={4} md={6} xs={12}>
            <IntegrationCard integration={integration} />
          </Grid>
        ))}
      </Grid>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Pagination count={3} size="small" />
      </Box>*/}
    </Stack>
  );
}

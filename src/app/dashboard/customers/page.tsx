"use client";
import * as React from 'react';
//import type { Metadata } from 'next';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Download as DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { Upload as UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';
import dayjs from 'dayjs';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Input from '@mui/material/Input';
import { config } from '@/config';
import { CustomersFilters } from '@/components/dashboard/customer/customers-filters';
import { CustomersTable } from '@/components/dashboard/customer/customers-table';
import type { Customer } from '@/components/dashboard/customer/customers-table';

//export const metadata = { title: `Customers | Dashboard | ${config.site.name}` } satisfies Metadata;

// Empty customer data
const customers: DailyPassengerCount[] = [];

export default function Page(): React.JSX.Element {
  const [openModal, setOpenModal] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const page = 0;
  const rowsPerPage = 20;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
    }
  };


  const handleUpload = async () => {
	
	const token = localStorage.getItem('token');
	const userId = localStorage.getItem('userId')
	
    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);

      try {
        const response = await fetch('http://localhost:7001/trainos-admin/report/upload/dailyPassengerVolume', {
          method: 'POST',
          headers: {
	        'Authorization': `Bearer ${token}`,
	        'userId': userId,
          },
          body: formData, 
        });

        if (response.ok) {
          console.log('File uploaded successfully');
        } else {
          console.error('Error uploading file:', response.status);
        }
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  };

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  // Use empty customer data
  const paginatedCustomers = applyPagination(customers, page, rowsPerPage);

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Passenger count record</Typography>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Button onClick={handleOpenModal} color="inherit" startIcon={<UploadIcon fontSize="var(--icon-fontSize-md)" />}>
              Import Spreadsheet Data
            </Button>
            {/*<Button color="inherit" startIcon={<DownloadIcon fontSize="var(--icon-fontSize-md)" />}>
              Export
            </Button>*/}
          </Stack>
        </Stack>
        {/*<div>
          <Button startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />} variant="contained">
            Add
          </Button>
        </div>*/}
      </Stack>
      <CustomersFilters />
	  <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>Import Spreadsheet Data</DialogTitle>
        <DialogContent>
          <Input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileChange}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (selectedFile) {
				handleUpload();
                console.log('File selected:', selectedFile.name);
				
              }
              handleCloseModal();
            }}
            color="primary"
            disabled={!selectedFile}
          >
            Upload
          </Button>
        </DialogActions>
      </Dialog>

      {/*<CustomersTable
        count={paginatedCustomers.length}
        page={page}
        rows={paginatedCustomers}
        rowsPerPage={rowsPerPage}
      />*/}
    </Stack>
  );
}

function applyPagination(rows: DailyPassengerCount[], page: number, rowsPerPage: number): Customer[] {
  return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}
"use client";
import * as React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

import { config } from '@/config';
import { Notifications } from '@/components/dashboard/settings/notifications';
import { Roles } from '@/components/dashboard/settings/roles';


export default function Page(): React.JSX.Element {
  const [tabIndex, setTabIndex] = React.useState(0);

  const handleChange = (_event: React.SyntheticEvent, newIndex: number) => {
    setTabIndex(newIndex);
  };

  return (
    <Stack spacing={3}>
      <div>
        <Typography variant="h4">System Settings</Typography>
      </div>
      <Tabs value={tabIndex} onChange={handleChange}>
        <Tab label="Roles" />
        <Tab label="Notifications" />
      </Tabs>
      <Box>
        {tabIndex === 0 && <Roles />}
        {tabIndex === 1 && <Notifications />}
      </Box>
    </Stack>
  );
}
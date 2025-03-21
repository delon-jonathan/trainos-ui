'use client';

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import { Bell as BellIcon } from '@phosphor-icons/react/dist/ssr/Bell';
import { List as ListIcon } from '@phosphor-icons/react/dist/ssr/List';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import { format } from 'date-fns'; // Using date-fns for formatting date

import { usePopover } from '@/hooks/use-popover';

import { MobileNav } from './mobile-nav';
import { UserPopover } from './user-popover';

export function MainNav(): React.JSX.Element {
  const [openNav, setOpenNav] = React.useState<boolean>(false);
  const [notificationCount, setNotificationCount] = React.useState<number>(0); // State to store notification count
  const [notifications, setNotifications] = React.useState<Array<any>>([]); // State to store notifications
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null); // Anchor for the popover
  const userPopover = usePopover<HTMLDivElement>();
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  // Function to simulate fetching notifications from an API
  const fetchNotifications = async () => {
    try {
      const response = await fetch('http://localhost:7001/trainos-admin/notification/getNewNotifications', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'userId': userId,
        },
      });
      const data = await response.json();
      setNotifications(data.data);
      setNotificationCount(data.data.length); // Update notification count with the fetched data
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  // Fetch notifications every 5 seconds
  React.useEffect(() => {
    fetchNotifications(); // Initial fetch
    const intervalId = setInterval(fetchNotifications, 5 * 1000); // Set interval for 5 seconds

    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, []);

  // Open notifications popover
  const handleBellClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget); // Set the anchor for the popover
  };

  // Close notifications popover
  const handleClosePopover = () => {
    setAnchorEl(null); // Close the popover
  };

  // Render notifications in the popover
  const renderNotifications = () => {
    return notifications.length === 0 ? (
      <Typography sx={{ p: 2 }}>No new notifications</Typography>
    ) : (
      notifications.map((notification, index) => (
        <Box key={index} sx={{ p: 2 }}>
          <Typography variant="body2">{notification.notificationDescription}</Typography>
          <Typography variant="caption" color="textSecondary">
            {format(new Date(notification.createdAt), 'PPP p')} {/* Format date */}
          </Typography>
        </Box>
      ))
    );
  };

  return (
    <React.Fragment>
      <Box
        component="header"
        sx={{
          borderBottom: '1px solid var(--mui-palette-divider)',
          backgroundColor: 'var(--mui-palette-background-paper)',
          position: 'sticky',
          top: 0,
          zIndex: 'var(--mui-zIndex-appBar)',
        }}
      >
        <Stack
          direction="row"
          spacing={2}
          sx={{ alignItems: 'center', justifyContent: 'space-between', minHeight: '64px', px: 2 }}
        >
          <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
            <IconButton
              onClick={(): void => {
                setOpenNav(true);
              }}
              sx={{ display: { lg: 'none' } }}
            >
              <ListIcon />
            </IconButton>
          </Stack>
          <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
            <Tooltip title="Notifications">
              <Badge badgeContent={notificationCount} color="success">
                <IconButton onClick={handleBellClick}>
                  <BellIcon />
                </IconButton>
              </Badge>
            </Tooltip>
            <Avatar
              onClick={userPopover.handleOpen}
              ref={userPopover.anchorRef}
              src="/assets/logo-github.png"
              sx={{ cursor: 'pointer' }}
            />
          </Stack>
        </Stack>
      </Box>

      {/* Notifications Popover */}
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClosePopover}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <Box sx={{ width: 300 }}>
          {renderNotifications()}
        </Box>
      </Popover>

      <UserPopover anchorEl={userPopover.anchorRef.current} onClose={userPopover.handleClose} open={userPopover.open} />
      <MobileNav
        onClose={() => {
          setOpenNav(false);
        }}
        open={openNav}
      />
    </React.Fragment>
  );
}
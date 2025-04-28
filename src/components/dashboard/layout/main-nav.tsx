'use client';

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import { format } from 'date-fns';
import { Bell as BellIcon } from '@phosphor-icons/react/dist/ssr/Bell';
import { List as ListIcon } from '@phosphor-icons/react/dist/ssr/List';

import { usePopover } from '@/hooks/use-popover';
import { MobileNav } from './mobile-nav';
import { UserPopover } from './user-popover';
import EventBus from '@/util/event-bus';

export function MainNav(): React.JSX.Element {
  const [openNav, setOpenNav] = React.useState<boolean>(false);
  const [notificationCount, setNotificationCount] = React.useState<number>(0);
  const [notifications, setNotifications] = React.useState<Array<any>>([]);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const userPopover = usePopover<HTMLDivElement>();
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  const stations = [
    "Recto", "Legarda", "Pureza", "V. Mapa", "J. Ruiz",
    "Gilmore", "Betty-Go Belmonte", "Araneta Cubao", "Anonas",
    "Katipunan", "Santolan", "Marikina-Pasig", "Antipolo"
  ];

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
      setNotificationCount(data.data.length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  React.useEffect(() => {
    fetchNotifications();
    const intervalId = setInterval(fetchNotifications, 5 * 1000);
    return () => clearInterval(intervalId);
  }, []);

  const handleBellClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = (notification: any) => {
	  if (notification.notifType === 1) {
	    const targetStationIndex = stations.indexOf(notification.notifContext);
	    //const targetDate = new Date("2023-02-02");
		const targetDate = new Date(notification.targetDate);
	
	    console.log('Clicked notification:', notification.notifContext);
	
	    EventBus.emit("stationChange", targetStationIndex);
	    EventBus.emit("notificationClicked", { date: targetDate });
	  }
  };

  const renderNotifications = () => {
    return notifications.length === 0 ? (
      <Typography sx={{ p: 2 }}>No new notifications</Typography>
    ) : (
      notifications.map((notification, index) => (
        <Box
          key={index}
          onClick={() => handleNotificationClick(notification)}
          sx={{
            p: 2,
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: 'action.hover',
            },
          }}
        >
          <Typography variant="body2">{notification.notificationDescription}</Typography>
          <Typography variant="caption" color="textSecondary">
            {format(new Date(notification.createdAt), 'PPP p')}
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
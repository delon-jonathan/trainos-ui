import * as React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';

export function Notifications(): React.JSX.Element {
  const [pushNotifications, setPushNotifications] = React.useState(false);
  const [notificationPrompt, setNotificationPrompt] = React.useState('');

  const handleNotificationPromptChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNotificationPrompt(event.target.value);
  };

  return (
    <Stack spacing={2}>
      <Typography variant="h6">Notification Settings</Typography>
      
      <FormControlLabel
        control={
          <Switch
            checked={pushNotifications}
            onChange={() => setPushNotifications(!pushNotifications)}
            name="pushNotifications"
          />
        }
        label="Push Notifications"
      />
      
      <TextField
        label="Custom Notification Prompt"
        value={notificationPrompt}
        onChange={handleNotificationPromptChange}
        variant="outlined"
        fullWidth
      />
    </Stack>
  );
}
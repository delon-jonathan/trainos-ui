import * as React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';

export function Notifications(): React.JSX.Element {
  const [pushNotifications, setPushNotifications] = React.useState(false);
  const [notificationPrompt, setNotificationPrompt] = React.useState('');
  const [threshold, setThreshold] = React.useState<number | ''>('');
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null); // State to store the success message
  
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  
  React.useEffect(() => {
    const fetchNotificationSettings = async () => {
      try {
        const response = await fetch('http://localhost:7001/trainos-admin/notification/settings', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'userId': userId,
          },
        });

        const data = await response.json();

        if (data.success) {
          // Update the state with API response data
          setNotificationPrompt(data.data.customNotification);
          setThreshold(data.data.maxPassengerCountThreshold);
          setPushNotifications(data.data.pushNotification === 'Y');
        } else {
          console.error('Failed to fetch notification settings.');
        }
      } catch (error) {
        console.error('Error fetching notification settings:', error);
      }
    };

    fetchNotificationSettings();
  }, [userId]);

  const handleNotificationPromptChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNotificationPrompt(event.target.value);
  };

  const handleThresholdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setThreshold(value === '' ? '' : Number(value));
  };

  const handleSaveSettings = async () => {
    try {
      const response = await fetch('http://localhost:7001/trainos-admin/notification/save', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'userId': userId,
        },
        body: JSON.stringify({
          pushNotification: pushNotifications ? 'Y' : 'N',
          customNotification: notificationPrompt,
          maxPassengerCountThreshold: threshold,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccessMessage('Settings saved successfully!'); // Show success message
        setTimeout(() => setSuccessMessage(null), 3000); // Hide message after 3 seconds
      } else {
        console.error('Failed to save settings.');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  return (
    <Stack spacing={2}>
      <Typography variant="h6">Notification Settings</Typography>

      {/* Push Notification Switch */}
      <FormControlLabel
        control={
          <Switch
            checked={pushNotifications}
            onChange={() => setPushNotifications(!pushNotifications)}
            name="pushNotifications"
          />
        }
        label="Push Forecast Notifications"
      />

      {/* Threshold input on new line */}
      <TextField
        label="Threshold"
        type="number"
        value={threshold}
        onChange={handleThresholdChange}
        variant="outlined"
        sx={{ width: 200 }}
        disabled={!pushNotifications}
        inputProps={{
          min: 0,
          step: 1,
          inputMode: 'numeric',
          pattern: '[0-9]*',
        }}
      />

      {/* Custom Notification Prompt */}
      <TextField
        label="Custom Forecast Notification"
        value={notificationPrompt}
        onChange={handleNotificationPromptChange}
        variant="outlined"
        fullWidth
      />

      <Typography variant="body2" color="text.secondary">
        You can use the parameters <code>{'{date}'}</code> for the prediction date and <code>{'{station}'}</code> for the station name.
        <br />
        Example: <br />
        <i>
          {`{date}`} Forecast: {`{station}`} station's passenger count has reached the maximum threshold. Recommend adding train trips.
        </i>
      </Typography>

      {/* Success message */}
      {successMessage && <Alert severity="success">{successMessage}</Alert>}

      {/* Save Button */}
      <Box textAlign="right">
        <Button variant="contained" color="primary" onClick={handleSaveSettings}>
          Save
        </Button>
      </Box>
    </Stack>
  );
}
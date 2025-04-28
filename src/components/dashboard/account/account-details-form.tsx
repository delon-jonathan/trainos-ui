'use client';

import * as React from 'react';
import {
  Button, Card, CardActions, CardContent, CardHeader, Divider,
  FormControl, InputLabel, OutlinedInput, Grid
} from '@mui/material';
import { useRouter } from 'next/navigation';

export function AccountDetailsForm(): React.JSX.Element {
  const router = useRouter();
  const [fullName, setFullName] = React.useState<string>(() => localStorage.getItem("fullName") || "");
  const username = React.useMemo(() => localStorage.getItem("username") || "", []);
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  // Password update fields
  const [currentPassword, setCurrentPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');

  const handleSaveDetails = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    try {
      const response = await fetch('http://localhost:7001/trainos-admin/account/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'userId': userId,
        },
        body: JSON.stringify({ fullName }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData?.message || 'Failed to update profile';
        throw new Error(errorMessage);
      }

      localStorage.setItem("fullName", fullName);

      alert('Save successfully!');
      router.refresh();
    } catch (error) {
      console.error(error);
      alert(error.message || 'An unexpected error occurred while updating the details.');
    }
  };

  const handleUpdatePassword = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (newPassword !== confirmPassword) {
      alert('New Password and Confirm Password do not match.');
      return;
    }

    try {
      const response = await fetch('http://localhost:7001/trainos-admin/account/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'userId': userId,
        },
        body: JSON.stringify({ currentPassword, password: newPassword }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData?.data?.message === 'Password not matched') {
          alert('Password not matched');
        } else {
          throw new Error('Failed to update password');
        }
      } else {
        alert('Password updated successfully!');
      }

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error(error);
      alert(error.message || 'An unexpected error occurred while updating the password.');
    }
  };

  return (
    <div>
      {/* Profile Update Form */}
      <form onSubmit={handleSaveDetails}>
        <Card>
          <CardHeader subheader="The information can be edited" title="Profile" />
          <Divider />
          <CardContent>
            <Grid container spacing={3}>
              <Grid item md={6} xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Name</InputLabel>
                  <OutlinedInput
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    label="Name"
                    name="fullName"
                  />
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Username</InputLabel>
                  <OutlinedInput
                    value={username}
                    label="Username"
                    name="username"
                    disabled
                  />
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
          <Divider />
          <CardActions sx={{ justifyContent: 'flex-end' }}>
            <Button type="submit" variant="contained">Save details</Button>
          </CardActions>
        </Card>
      </form>

      {/* Password Update Form */}
      <form onSubmit={handleUpdatePassword}>
        <Card sx={{ mt: 4 }}>
          <CardHeader subheader="Update your password" title="Change Password" />
          <Divider />
          <CardContent>
            <Grid container spacing={3}>
              <Grid item md={6} xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Current Password</InputLabel>
                  <OutlinedInput 
                    label="Current Password" 
                    name="currentPassword" 
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>New Password</InputLabel>
                  <OutlinedInput 
                    label="New Password" 
                    name="newPassword" 
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Confirm New Password</InputLabel>
                  <OutlinedInput 
                    label="Confirm New Password" 
                    name="confirmPassword" 
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
          <Divider />
          <CardActions sx={{ justifyContent: 'flex-end' }}>
            <Button type="submit" variant="contained" color="primary">Update Password</Button>
          </CardActions>
        </Card>
      </form>
    </div>
  );
}
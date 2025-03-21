"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import EditIcon from "@mui/icons-material/Edit";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import { CompaniesFilters } from "@/components/dashboard/integrations/integrations-filters";

export default function Page(): React.JSX.Element {
  const [searchResults, setSearchResults] = React.useState<any>(null);
  const [searchTypeUser, setSearchTypeUser] = React.useState<string | null>(null);
  const [searchParam, setSearchParam] = React.useState<string | null>(null);
  const [open, setOpen] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);
  const [editUser, setEditUser] = React.useState<any>(null);
  const [role, setRole] = React.useState("");
  const [roles, setRoles] = React.useState<string[]>([]);
  const [password, setPassword] = React.useState("");
  const [newUser, setNewUser] = React.useState({
    fullName: "",
    username: "",
    roleId: "",
    password: "",
  });

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  React.useEffect(() => {
    if (open) {
      const fetchRoles = async () => {
        try {
          let url = "http://localhost:7001/trainos-admin/admin/getRoles";
          const response = await fetch(url, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
              userId: userId,
            },
          });
          if (!response.ok) throw new Error("Failed to fetch roles");

          const data = await response.json();
          setRoles(data.data);
        } catch (error) {
          console.error("Error fetching roles:", error);
        }
      };
      fetchRoles();
    }
  }, [open]);

  const handleOpen = (user?: any) => {
    if (user) {
      setIsEditing(true);
      setEditUser(user);
      const matchedRole = roles.find((r) => r.roleName === user.roleName);
      setRole(matchedRole ? matchedRole.roleId : "");
    } else {
      setIsEditing(false);
      setNewUser({ fullName: "", username: "", roleId: "", password: "" });
      setRole("");
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleSaveUser = async () => {
    try {
      const url = isEditing
        ? "http://localhost:7001/trainos-admin/admin/updateUser"
        : "http://localhost:7001/trainos-admin/admin/createUser";

      const payload = isEditing
        ? {
            username: editUser.username,
            fullName: editUser.fullName,
            roleId: role,
            password: password || null,
          }
        : {
            username: newUser.username,
            fullName: newUser.fullName,
            roleId: newUser.roleId,
            password: newUser.password || null,
          };

      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          userId: userId,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to save user");

      console.log("User saved successfully");
      handleClose();
      handleSearch();
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  const handleGeneratePassword = () => {
    const newPassword = Math.random().toString(36).slice(-8);
    setPassword(newPassword);
    if (!isEditing) setNewUser((prev) => ({ ...prev, password: newPassword }));
  };

  const handleSearch = async () => {
    setSearchResults([]);

    const queryParams = new URLSearchParams({
      searchTypeUser,
      searchParam,
    });

    try {
      let url = `http://localhost:7001/trainos-admin/admin/searchUsers`;
      if (searchTypeUser && searchParam) {
        url = `http://localhost:7001/trainos-admin/admin/searchUsers?${queryParams}`;
      }
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          userId: userId,
        },
      });

      if (!response.ok) throw new Error("Failed to search users");

      const data = await response.json();
      setSearchResults(data.data);
    } catch (error) {
      console.error("API call failed", error);
    }
  };

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3} alignItems="center" justifyContent="space-between">
        <Typography variant="h4">Users</Typography>
        <Button variant="contained" color="primary" onClick={() => handleOpen()}>
          Add User
        </Button>
      </Stack>
      <CompaniesFilters onSearch={handleSearch} setSearchTypeUser={setSearchTypeUser} setSearchParam={setSearchParam} />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Description</TableCell>
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
                <TableCell>
                  <Button startIcon={<EditIcon />} size="small" color="primary" onClick={() => handleOpen(user)}>
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal open={open} onClose={handleClose}>
        <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 400, bgcolor: "background.paper", boxShadow: 24, p: 4 }}>
          <Typography variant="h6" component="h2" gutterBottom>
            {isEditing ? "Edit User" : "Add User"}
          </Typography>

          <TextField
			  fullWidth
			  margin="normal"
			  label="Full Name"
			  value={isEditing ? editUser?.fullName || "" : newUser.fullName}
			  onChange={(e) => {
			    if (isEditing) {
			      setEditUser((prev) => ({ ...prev, fullName: e.target.value }));
			    } else {
			      setNewUser((prev) => ({ ...prev, fullName: e.target.value }));
			    }
			  }}
		  />

         <TextField
			  fullWidth
			  margin="normal"
			  label="Username"
			  value={isEditing ? editUser?.username || "" : newUser.username}
			  onChange={(e) => {
			    if (!isEditing) {
			      setNewUser((prev) => ({ ...prev, username: e.target.value }));
			    }
			  }}
			  disabled={isEditing}
		/>

          <FormControl fullWidth margin="normal">
			  <Select
			    value={isEditing ? role : newUser.roleId}
			    onChange={(e) => {
			      if (isEditing) {
			        setRole(e.target.value);
			      } else {
			        setNewUser((prev) => ({ ...prev, roleId: e.target.value }));
			      }
			    }}
			  >
			    {roles.map((r) => (
			      <MenuItem key={r.roleId} value={r.roleId}>
			        {r.roleName}
			      </MenuItem>
			    ))}
			  </Select>
		  </FormControl>


          <TextField fullWidth margin="normal" label="Password" value={password} disabled />
          {<Button fullWidth variant="contained" color="secondary" sx={{ mt: 2 }} onClick={handleGeneratePassword}>Generate Password</Button>}

          <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
            <Button variant="contained" color="primary" onClick={handleSaveUser}>{isEditing ? "Save" : "Add"}</Button>
            <Button variant="outlined" onClick={handleClose}>Cancel</Button>
          </Stack>
        </Box>
      </Modal>
    </Stack>
  );
}
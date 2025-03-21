import * as React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography, Stack, Box, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Checkbox, FormControlLabel, FormGroup, TextField } from '@mui/material';

export function Roles(): React.JSX.Element {
  const [roles, setRoles] = React.useState<{ roleId: number; roleName: string; roleDescription: string; permissions: number[] }[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);
  const [open, setOpen] = React.useState<boolean>(false);
  const [selectedRole, setSelectedRole] = React.useState<{ roleId: number; roleName: string; roleDescription: string; permissions: number[] } | null>(null);
  const [permissions, setPermissions] = React.useState<any[]>([]); // This will hold the hierarchical permission structure
  const [newRoleName, setNewRoleName] = React.useState<string>(''); // For new role name input
  const [newRoleDescription, setNewRoleDescription] = React.useState<string>(''); // For new role description input
  const [selectedPermissions, setSelectedPermissions] = React.useState<Set<number>>(new Set()); // For tracking selected permissions

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  const flattenPermissions = (data: any[]) => {
	  const flattenedPermissions: any[] = [];
	
	  // Helper function to recursively flatten permissions
	  const flattenPermission = (permissions: any[], parentId: number) => {
	    permissions.forEach((permission) => {
	      // For root menus, set the parentMenuId to a unique value (e.g., 1000) and keep menuId different
	      flattenedPermissions.push({
	        parentMenuId: parentId, // Root menus will point to 1000 or a different unique value
	        menuId: permission.id,
	        menuName: permission.name,
	        menuDescription: permission.description,
	        enabled: permission.enabled,
	      });
	
	      // Recursively process child permissions if they exist
	      if (permission.children && permission.children.length > 0) {
	        flattenPermission(permission.children, permission.id); // For child menus, use the parent menuId
	      }
	    });
	  };
	
	  // Start the flattening process from the root menus (e.g., menus with parentId === 1000)
	  data.forEach((menu) => {
	    if (menu.parentId !== menu.id) { // This identifies the root menu (where parentId != menuId)
	      flattenPermission([menu], 1000); // Start flattening from root menu (with a parentId of 1000 or another unique ID)
	    } else {
	      flattenPermission([menu], menu.id); // This is the root menu with different parentMenuId
	    }
	  });
	
	  return flattenedPermissions;
  };

  const transformPermissions = (data: any[]) => {
    const menuMap: { [key: number]: any } = {};
    const transformedPermissions: any[] = [];
    
    data.forEach((menu) => {
      const { menuId, parentMenuId, menuName, menuDescription, enabled } = menu;
      menuMap[menuId] = {
        id: menuId,
        parentId: parentMenuId,
        name: menuName,
        description: menuDescription,
        enabled: enabled,
        children: [] // Initialize an empty array for children
      };
    });
    
    data.forEach((menu) => {
      const { parentMenuId, menuId } = menu;
      if (parentMenuId !== menuId) { // Skip if it's the root menu (i.e., it has no parent)
        if (menuMap[parentMenuId]) {
          menuMap[parentMenuId].children.push(menuMap[menuId]);
        }
      }
    });
    
    for (const menuId in menuMap) {
      const menu = menuMap[menuId];
      if (menu.parentId === 1000) {
        transformedPermissions.push(menu); // Only add the root menus (first generation)
      }
    }

    return transformedPermissions;
  };


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
	  } catch (err) {
	    setError((err as Error).message);
	  } finally {
	    setLoading(false);
	  }
  };

  React.useEffect(() => {
	
    fetchRoles();
    setPermissions([
      {
        id: 1100,
        parentId: 1000,
        name: "System",
        description: "Menu for system settings",
        enabled: "Y",
        children: [
          { id: 1101, parentId: 1100, name: "Roles", description: "Settings for managing user roles", enabled: "Y" },
        ]
      },
      {
        id: 1200,
        parentId: 1000,
        name: "Users",
        description: "Menu for user related settings",
        enabled: "Y",
        children: [
          { id: 1201, parentId: 1200, name: "Search Users", description: "Permission for search users", enabled: "Y" },
          { id: 1202, parentId: 1200, name: "Edit Users", description: "Permission for edit users", enabled: "N" },
          { id: 1203, parentId: 1200, name: "Create Users", description: "Permission for create users", enabled: "Y" },
          { id: 1204, parentId: 1200, name: "Manage User Roles", description: "Permission for managing user roles", enabled: "N" },
        ]
      },
      {
        id: 1300,
        parentId: 1000,
        name: "Report",
        description: "Menu for report related functions",
        enabled: "Y",
        children: [
          { id: 1301, parentId: 1300, name: "Search Report", description: "Permission for report search", enabled: "Y" },
          { id: 1302, parentId: 1300, name: "Upload Report", description: "Permission for report upload", enabled: "N" },
          { id: 1303, parentId: 1300, name: "Predict Passenger Count", description: "Permission for passenger count prediction", enabled: "Y" },
        ]
      }
    ]);
  }, [token, userId]);

  const handleClickOpen = async (roleId: number, roleName: string, roleDescription: string) => {
    try {
      let url = `http://localhost:7001/trainos-admin/admin/getPermissions?roleId=${roleId}`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          userId: userId,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch role details");

      const data = await response.json();
      const transformedPermissions = transformPermissions(data.data);
      setPermissions(transformedPermissions);
	  console.log(transformedPermissions);
      setSelectedRole({
      menuList: data.data,
      roleName: roleName ?? null,
      roleDescription: roleDescription ?? null,
	  roleId: roleId ?? null,
    });
      setOpen(true);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleAddClickOpen = () => {
    setSelectedRole(null); // No role selected for adding
    setNewRoleName(''); // Reset new role name input
    setNewRoleDescription(''); // Reset new role description input
    setSelectedPermissions(new Set()); // Reset selected permissions for Add Role
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedRole(null);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>, permissionId: number) => {
  	  const updatedPermissions = new Set(selectedPermissions);
	  const updatedPermissionList = [...permissions]; // Create a copy of the permissions array
	
	  // Update the selectedPermissions set
	  if (event.target.checked) {
	    updatedPermissions.add(permissionId);
	  } else {
	    updatedPermissions.delete(permissionId);
	  }
	
	  // Update the specific permission's 'enabled' field in the permissions array
	  const updatePermission = (permissions: any[], permissionId: number) => {
	    for (let permission of permissions) {
	      if (permission.id === permissionId) {
	        permission.enabled = event.target.checked ? "Y" : "N"; // Set the "enabled" field based on the checkbox state
	        break;
	      }
	      if (permission.children && permission.children.length > 0) {
	        updatePermission(permission.children, permissionId); // Recursively update child permissions
	      }
	    }
	  };
	
	  updatePermission(updatedPermissionList, permissionId); // Update the permission in the list
	
	  // Now update both selectedPermissions and permissions state
	  setSelectedPermissions(updatedPermissions);
	  setPermissions(updatedPermissionList); // Update the permissions array with the new state
  };

  const renderPermissions = (permissions: any[]) => {
    return permissions.map((permission) => (
      <FormGroup key={permission.id}>
        <FormControlLabel
          control={
            <Checkbox
              checked={selectedPermissions.has(permission.id) || (selectedRole && permission.enabled === "Y")}
              onChange={(e) => handleChange(e, permission.id)}
            />
          }
          label={permission.name}
        />
        {permission.children && permission.children.length > 0 && (
          <Box pl={3}>
            {renderPermissions(permission.children)} 
          </Box>
        )}
      </FormGroup>
    ));
  };

  const handleSave = async () => {
	console.log(flattenPermissions(permissions));
    const roleToSave = selectedRole
      ? { 	menuList: flattenPermissions(permissions)
			, roleName: selectedRole.roleName
			, roleDescription: selectedRole.roleDescription
			, roleId: selectedRole.roleId
		}
      : { roleName: newRoleName, roleDescription: newRoleDescription, menuList: flattenPermissions(permissions)};

    try {
      let url = selectedRole ? "http://localhost:7001/trainos-admin/admin/updateRole" : "http://localhost:7001/trainos-admin/admin/createRole";
      const response = await fetch(url, {
        method: selectedRole ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          userId: userId,
        },
        body: JSON.stringify(roleToSave),
      });
      if (!response.ok) throw new Error("Failed to save role");

      const data = await response.json();
      setRoles(data.data);
      handleClose();
	  fetchRoles();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <Stack spacing={2}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6">User Roles</Typography>
        <Button variant="contained" onClick={handleAddClickOpen}>Add Role</Button>
      </Box>

      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Role ID</strong></TableCell>
                <TableCell><strong>Role Name</strong></TableCell>
                <TableCell><strong>Role Description</strong></TableCell>
                <TableCell align="right"><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
           <TableBody>
			  {Array.isArray(roles) && roles.length > 0 ? (
			    roles.map((role) => (
			      <TableRow key={role.roleId}>
			        <TableCell>{role.roleId}</TableCell>
			        <TableCell>{role.roleName}</TableCell>
			        <TableCell>{role.roleDescription}</TableCell>
			        <TableCell align="right">
			          <Button variant="outlined" onClick={() => handleClickOpen(role.roleId, role.roleName, role.roleDescription)}>Edit</Button>
			        </TableCell>
			      </TableRow>
			    ))
			  ) : (
			    <TableRow>
			      <TableCell colSpan={4} align="center">
			        No roles available
			      </TableCell>
			    </TableRow>
			  )}
			</TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{selectedRole ? "Edit Role" : "Add Role"}</DialogTitle>
        <DialogContent>
          <TextField
            label="Role Name"
            fullWidth
            value={selectedRole ? selectedRole.roleName : newRoleName}
            onChange={(e) => {
              if (selectedRole) {
                setSelectedRole({ ...selectedRole, roleName: e.target.value });
              } else {
                setNewRoleName(e.target.value);
              }
            }}
            margin="normal"
          />
          <TextField
            label="Role Description"
            fullWidth
            value={selectedRole ? selectedRole.roleDescription : newRoleDescription}
            onChange={(e) => {
              if (selectedRole) {
                setSelectedRole({ ...selectedRole, roleDescription: e.target.value });
              } else {
                setNewRoleDescription(e.target.value);
              }
            }}
            margin="normal"
          />
          <Box mt={2}>
            <Typography variant="subtitle1">Permissions</Typography>
            {renderPermissions(permissions)}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">Cancel</Button>
          <Button onClick={handleSave} color="primary">{selectedRole ? "Save" : "Add Role"}</Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
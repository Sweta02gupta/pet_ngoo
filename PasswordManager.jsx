import axios from "axios";
import { useEffect, useState } from "react";
import SkeletonLoader from "../../../components/Loaders/SkeletonLoader";
import SnackBarAlert from "../../../components/Dialog/SnackBarAlert";
import TokenReverification from "../../../components/Dialog/TokenReverification";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  TextField,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { DataGrid } from "@mui/x-data-grid";
import CircularLoader from "../../../components/Loaders/CircularLoader";

const PasswordManager = () => {
  const columns = [
    {
      field: "sno",
      headerName: "S. No.",
      width: 60,
    },
    {
      field: "userName",
      headerName: "User Name",
      width: 150,
    },
    {
      field: "userEmail",
      headerName: "Email",
      width: 250,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 500,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          {/* Change Password Button */}
          <Button
            variant="contained"
            size="small"
            color="success"
            onClick={() => handleChangePasswordDialogOpen(params.row)}
          >
            Change Password
          </Button>
          {/* Edit Button */}
          <Button
            variant="contained"
            size="small"
            color="primary"
            onClick={() => handleEditDialogOpen(params.row)}
          >
            Edit
          </Button>
          {/* Delete Button */}
          {
           
              <Button
                variant="contained"
                size="small"
                color="error"
                onClick={() => handleDeleteUser(params.row.id)}
              >
                Delete
              </Button>
            
          }
        </Box>
      ),
    },
  ];

  const [userList, setUserList] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [toggleChangePasswordDialog, setToggleChangePasswordDialog] =
    useState(false);
  const [dialogLoader, setDialogLoader] = useState(false);
  const [skeletonLoader, setSkeletonLoader] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editUserName, setEditUserName] = useState("");
  const [editUserEmail, setEditUserEmail] = useState("");
  const [showTokenReverificationDialog, setShowTokenReverificationDialog] =
    useState(false);
  const skeletons = Array.from({ length: 8 }, (_, index) => (
    <SkeletonLoader key={index} />
  ));
  const [snackbarOpen, setSnackbarOpen] = useState({
    open: false,
    message: "",
    type: "success",
  });

  // Fetch user data from the API
  const fetchUserData = () => {
    setSkeletonLoader(true);
    axios
      .get(`${import.meta.env.VITE_API_URL}/login/getAll`, {
        headers: {
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem("AFA_user"))?.token
          }`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        if (response.status === 200) {
          const sortedUsers = response.data
            .filter((user) => user.afaUserName !== "Admin") // Filter out "Admin" rows
            .map((user, i) => ({
              sno: i + 1,
              id: user.afaUserId,
              userName: user.afaUserName,
              userEmail: user.afaUserEmail,
            }));
  
          setUserList(sortedUsers);
        }
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      })
      .finally(() => {
        setSkeletonLoader(false);
      });
  };
  
  const handleEditDialogOpen = (user) => {
    setSelectedUser(user);
    setEditUserName(user.userName);
    setEditUserEmail(user.userEmail);
    setEditDialogOpen(true);
  };

  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
    setSelectedUser(null);
    setEditUserName("");
    setEditUserEmail("");
  };

  const handleUpdateUser = () => {
    if (!editUserName || !editUserEmail) {
      setSnackbarOpen({
        open: true,
        message: "Both username and email are required.",
        type: "error",
      });
      return;
    }

    axios
      .put(
        `${import.meta.env.VITE_API_URL}/login/update/${selectedUser.id}`,
        {
          username: editUserName,
          email: editUserEmail,
          role: ["ViewVet", "ViewRescueVet", "admin"], // Adjust roles if dynamic
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      )
      .then(() => {
        setSnackbarOpen({
          open: true,
          message: "User updated successfully.",
          type: "success",
        });
        fetchUserData();
      })
      .catch((error) => {
        console.error("Error updating user:", error);
        setSnackbarOpen({
          open: true,
          message: "Error updating user.",
          type: "error",
        });
      });
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      axios
      .delete(`${import.meta.env.VITE_API_URL}/login/${userId}`, {
        headers: {
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem("AFA_user"))?.token
          }`,
        },
      })
        .then(() => {
          setSnackbarOpen({
            open: true,
            message: "User deleted successfully.",
            type: "success",
          });
          fetchUserData(); // Refresh user list
        })
        .catch((error) => {
          console.error("Error deleting user:", error.response?.data || error.message);
          setSnackbarOpen({
            open: true,
            message: "Failed to delete user. Check console for details.",
            type: "error",
          });
        });
    }
  };
  
 
  // Open the change password dialog for the selected user
  const handleChangePasswordDialogOpen = (user) => {
    setSelectedUser(user);
    setToggleChangePasswordDialog(true);
  };

  // Close the change password dialog
  const handleChangePasswordDialogClose = () => {
    setToggleChangePasswordDialog(false);
    setSelectedUser(null);
    setNewPassword("");
    setConfirmPassword("");
  };

  // Handle password change
  const handleChangePassword = () => {
    // Ensure passwords match and are at least 6 characters long
    if (newPassword.length < 6 || newPassword !== confirmPassword) {
      setSnackbarOpen({
        open: true,
        message: "Passwords must match and be at least 6 characters long",
        type: "error",
      });
      return;
    }

    setDialogLoader(true);
    axios
      .put(
        `${import.meta.env.VITE_API_URL}/login/setpassword/${selectedUser.id}`,
        {
          password: newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${
              JSON.parse(localStorage.getItem("AFA_user"))?.token
            }`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        if (response.status === 200) {
          setSnackbarOpen({
            open: true,
            message: "Password changed successfully!",
            type: "success",
          });
          handleChangePasswordDialogClose();
        }
      })
      .catch((error) => {
        console.error("Error changing password:", error);
        setSnackbarOpen({
          open: true,
          message:
            error?.response?.data?.message ||
            "Error changing password. Please try again.",
          type: "error",
        });
      })
      .finally(() => {
        setDialogLoader(false);
      });
  };

  // Filtered user list based on search query
  const filteredUserList = userList.filter((user) =>
    user.userName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    fetchUserData();
  }, []);
  //console.log("Selected user:", selectedUser);

  return (
    <>
      {skeletonLoader ? (
        <div className="mt-[65px] w-screen px-5 md:px-20 lg:px-72 pt-10 flex flex-col justify-center items-center gap-3">
          {skeletons}
        </div>
      ) : (
        <div className="mt-[65px] p-5 md:py-10 md:px-16 flex flex-col gap-10 md:gap-5">
          <div className="flex items-center justify-between gap-5">
            <p className="text-xl md:text-3xl">User Manager</p>
            <TextField
              label="Search"
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: -2 }}
              placeholder="Search User"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="">
            <Box sx={{ height: 450, maxWidth: "100%" }}>
              <DataGrid
                rows={filteredUserList}
                columns={columns}
                initialState={{
                  pagination: {
                    paginationModel: {
                      pageSize: 10,
                    },
                  },
                }}
                pageSizeOptions={[5, 10, 20]}
                checkboxSelection={false}
                disableColumnMenu
                disableColumnFilter
                disableColumnSelector
                disableDensitySelector
                disableSelectionOnClick
                disableColumnResize
              />
            </Box>
          </div>
        </div>
      )}
       <Dialog open={editDialogOpen} onClose={handleEditDialogClose}>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="User Name"
            fullWidth
            value={editUserName}
            onChange={(e) => setEditUserName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Email"
            fullWidth
            value={editUserEmail}
            onChange={(e) => setEditUserEmail(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditDialogClose}>Cancel</Button>
          <Button onClick={handleUpdateUser} variant="contained">Update</Button>
        </DialogActions>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog
        open={toggleChangePasswordDialog}
        onClose={handleChangePasswordDialogClose}
      >
        <DialogTitle>Change Password for {selectedUser?.userName}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="new-password"
            label="New Password"
            type="password"
            fullWidth
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <TextField
            margin="dense"
            id="confirm-password"
            label="Confirm New Password"
            type="password"
            fullWidth
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleChangePasswordDialogClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleChangePassword}
            color="primary"
            variant="contained"
          >
            Change Password
          </Button>
          {dialogLoader && <CircularLoader />}
        </DialogActions>
      </Dialog>

      <SnackBarAlert
        snackbarOpen={snackbarOpen}
        setSnackbarOpen={setSnackbarOpen}
      />
      {showTokenReverificationDialog && (
        <TokenReverification
          setShowTokenReverificationDialog={setShowTokenReverificationDialog}
        />
      )}
    </>
  );
};

export default PasswordManager;

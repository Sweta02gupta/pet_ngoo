import { Alert, Snackbar } from "@mui/material";
import React from "react";

const SnackBarAlert = ({ snackbarOpen, setSnackbarOpen }) => {
  const handleSnackbarClose = (_event, reason) => {
    if (reason === "clickaway") return;

    setSnackbarOpen({
      ...snackbarOpen,
      open: false,
    });
  };
  return (
    <Snackbar
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      open={snackbarOpen.open}
      autoHideDuration={7000}
      onClose={handleSnackbarClose}
    >
      <Alert
        onClose={handleSnackbarClose}
        severity={snackbarOpen.type}
        sx={{ width: "100%" }}
      >
        {snackbarOpen.message}
      </Alert>
    </Snackbar>
  );
};

export default SnackBarAlert;

import { Button, CircularProgress, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import SnackBarAlert from "./SnackBarAlert";
import axios from "axios";

const TokenReverification = ({ setShowTokenReverificationDialog }) => {
  const [currentUser, setCurrentUser] = useState("");
  const [password, setPassword] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState({
    open: false,
    message: "",
    type: "success",
  });
  const [loading, setLoading] = useState(false);

  const loginTokenAuthentication = () => {
    setLoading(true);
    const unverifiedUser = JSON.parse(localStorage.getItem("AFA_user"));
    axios
      .get(`${import.meta.env.VITE_API_URL}/login`, {
        headers: {
          Authorization: `Bearer ${unverifiedUser.token}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log("then", response);
        if (response.status === 200) {
          localStorage.setItem(
            "AFA_user",
            JSON.stringify({
              ...unverifiedUser,
              username: response.data.auth.username,
              email: response.data.auth.email,
              userId: response.data.auth.id,
              expiry: response.data.auth.expiry,
            })
          );
          setShowTokenReverificationDialog(false);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("catch", error);
        if (error.code === "ERR_NETWORK") {
          setSnackbarOpen({
            open: true,
            message: "Error 503: Server is down",
            type: "error",
          });
        } else {
          setSnackbarOpen({
            open: true,
            message: error?.response?.data?.message,
            type: "error",
          });
        }
        setLoading(false);
      });
  };

  const handleLogin = () => {
    setLoading(true);
    let data = JSON.stringify({
      username: currentUser,
      password,
    });

    axios
      .post(`${import.meta.env.VITE_API_URL}/login`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log("then", response);
        if (response.status === 200) {
          localStorage.setItem("AFA_user", JSON.stringify(response.data.data));
          loginTokenAuthentication();
          return;
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("catch", error);
        if (error.code === "ERR_NETWORK") {
          setSnackbarOpen({
            open: true,
            message: "Error 503: Server is down",
            type: "error",
          });
        } else {
          setSnackbarOpen({
            open: true,
            message: error?.response?.data?.message,
            type: "error",
          });
        }
        setLoading(false);
      });
  };

  const handleSubmit = () => {
    if (password.length < 6) {
      setSnackbarOpen({
        open: true,
        message: "Password length is less than 6 characters",
        type: "info",
      });
    } else {
      handleLogin();
    }
  };

  useEffect(() => {
    const userName = JSON.parse(localStorage.getItem("AFA_user")).username;
    setCurrentUser(userName);
  }, []);
  return (
    <>
      <div className="fixed top-0 left-0 w-screen h-screen flex justify-center items-center bg-black bg-opacity-30 z-[600]">
        {loading ? (
          <CircularProgress />
        ) : (
          <div className="border rounded-xl w-[90%] bg-white max-w-[30rem]">
            <div className="border-b border-gray-300 py-2 px-3 font-extrabold w-full bg-yellow-400 rounded-t-xl">
              Your session has expired. <br />
              <span className="text-sm font-normal">
                To continue working, you need to re-verify yourself
              </span>
            </div>
            <div className="w-full py-2 px-3">
              <span className="w-full text-sm">
                You are currently logged in as{" "}
                <b className="font-bold text-lg ml-1">{currentUser}</b>
              </span>
              <div className="flex flex-col items-start justify-center px-3 my-2 gap-1">
                <span className="font-semibold">Enter the password:</span>
                <TextField
                  size="small"
                  type="password"
                  placeholder="Type..."
                  variant="outlined"
                  fullWidth
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="w-full flex items-center justify-end">
                <Button variant="contained" onClick={handleSubmit}>
                  Verify
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      <SnackBarAlert
        snackbarOpen={snackbarOpen}
        setSnackbarOpen={setSnackbarOpen}
      />
    </>
  );
};

export default TokenReverification;

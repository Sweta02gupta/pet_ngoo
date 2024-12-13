import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Avatar,
  Button,
  Divider,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import { FaUserCircle } from "react-icons/fa";
import { RiArrowDropDownLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom"; // Ensure you're using React Router

const UserSettings = ({ handleLogout }) => {
  const [currentUser, setCurrentUser] = useState("admin"); // Default to admin
  const [networkStatus, setNetworkStatus] = useState({
    color: "border-gray-500",
    status: "Calculating",
    tooltipText: "Measuring network speed.",
  });
  const navigate = useNavigate(); // Use navigate hook for redirection

  const measureNetworkSpeed = () => {
    console.log("Started Measuring");
    const url =
      "https://images.unsplash.com/photo-1679678691010-985ab6b8ff62?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1169&q=80";
    const startTime = performance.now();

    fetch(url, { method: "HEAD" })
      .then((response) => {
        const fileSize = response.headers.get("content-length");
        const img = new Image();
        img.onload = () => {
          const endTime = performance.now();
          const duration = endTime - startTime; // in milliseconds
          const speed = fileSize / (duration / 1000); // in bytes per second
          const speedInKbs = Math.floor(speed / 1000);
          console.log(
            `${new Date()} Image loaded in ${duration} ms at ${speedInKbs} KBytes/S`
          );
          if (speedInKbs <= 65) {
            setNetworkStatus({
              color: "border-red-500",
              status: "Poor",
              tooltipText:
                "Your network speed is very slow. Try considering a switch to the offline mode",
            });
          } else if (speedInKbs > 65 && speedInKbs <= 125) {
            setNetworkStatus({
              color: "border-yellow-500",
              status: "Average",
              tooltipText:
                "Your network speed is average. Uploading new files may take time.",
            });
          } else if (speedInKbs > 125) {
            setNetworkStatus({
              color: "border-green-500",
              status: "Good",
              tooltipText: "Your network speed is great.",
            });
          }
        };
        img.src = url;
      })
      .catch((err) => {
        console.error(err);
        setNetworkStatus({
          color: "border-gray-500",
          status: "-N/A-",
        });
      });
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  

  useEffect(() => {
    const userName = JSON.parse(localStorage.getItem("AFA_user"))?.username || "admin";
    setCurrentUser(userName);
  }, []);

  useEffect(() => {
    measureNetworkSpeed();
    const interval = setInterval(() => {
      measureNetworkSpeed();
    }, 60000 * 2);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Tooltip title={`${networkStatus.tooltipText}`} placement="bottom">
        <div
          className={`absolute right-5 top-1 border-[3px] ${networkStatus.color} rounded-full p-1 flex items-center justify-center gap-1 md:p-2 cursor-pointer`}
          onClick={handleClick}
        >
          <FaUserCircle size={35} className="text-slate-300 ml-1" />
          <span className="hidden md:flex ml-[2px] tracking-tighter">
            {currentUser}
          </span>
          <RiArrowDropDownLine size={25} />
        </div>
      </Tooltip>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem
          sx={{ display: { xs: "block", md: "none" }, fontWeight: 700 }}
        >
          <div className="flex flex-col justify-center items-start">
            <span className="text-xs italic font-semibold text-blue-500">
              Welcome,
            </span>
            <span className="font-bold">{currentUser}</span>
          </div>
        </MenuItem>
        <Divider sx={{ display: { xs: "block", md: "none" } }} />
        <MenuItem>
          <span className="font-bold">Switch Role:</span>
        </MenuItem>
        <MenuItem onClick={() => handleRoleChange("admin")}>
          Admin
        </MenuItem>
       
        <Divider sx={{ bgcolor: "red" }} />
        <MenuItem onClick={handleLogout} sx={{ color: "red" }}>
          Logout
        </MenuItem>
      </Menu>
    </>
  );
};

UserSettings.propTypes = {
  handleLogout: PropTypes.func.isRequired,
};

export default UserSettings;

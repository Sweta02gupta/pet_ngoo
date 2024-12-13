import React, { useState, useEffect } from "react";
import {
  Button,
  InputAdornment,
  TextField,
  Tooltip,
  Menu,
  MenuItem,
} from "@mui/material";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import SwapVertIcon from "@mui/icons-material/SwapVert"; // New icon for Sort By
import FilterAltIcon from "@mui/icons-material/FilterAlt"; // New icon for Filter By
import { GrRefresh } from "react-icons/gr";
import { AppContext } from "../../context/SuperProvider";
import { useContext } from "react";
import axios from "axios";
//import { sortArrayByUpdatedAt } from "../../utils/CustomUtilityFunctions";
//import DogAccordion from "../../../../components/Accordion/DogAccordion";
const ViewControllers = ({
  searchQuery,
  setSearchQuery,
  fetchAllTransaction,
  showFromDate,
  setShowFromDate,
  dateFilter,
  showToDate,
  setShowToDate,
  handleFilterDataWithDate,
}) => {
  return (
    <div className="w-full flex flex-col sm:flex-grow gap-4 p-2 sm:p-4">
      {/* Search Bar */}
      <div className="flex items-center w-full">
      <TextField
  type="search"
  label="Search"
  fullWidth
  placeholder="Enter to search"
  InputProps={{
    startAdornment: (
      <InputAdornment position="start">
        <SearchOutlinedIcon />
      </InputAdornment>
    ),
    autoComplete: "off",
  }}
  variant="standard"
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
  className="w-full px-4" // Ensures full width on all screens
  sx={{
    "& .MuiInputBase-root": {
      fontSize: { xs: "16px", sm: "16px" }, // Adjust input text size
      padding: { xs: "12px", sm: "8px" }, // Input padding for mobile and larger screens
    },
    "& .MuiInputLabel-root": {
      fontSize: { xs: "14px", sm: "14px" }, // Responsive label size
    },
    "& .MuiInputLabel-shrink": {
      transform: "translate(0, -10px)", // Adjust label shrink position
    },
    "& .MuiInputAdornment-root": {
      marginRight: "8px", // Icon spacing
    },
    "& input::placeholder": {
      fontSize: { xs: "12px", sm: "14px" }, // Smaller placeholder text for mobile
    },
    width: "100%", // Ensure full width through sx
  }}
/>


        <Tooltip title="Refresh">
          <div
            className="cursor-pointer p-2 flex-shrink-0 ml-2"
            onClick={() => fetchAllTransaction()}
          >
            <GrRefresh className="text-xl font-semibold" />
          </div>
        </Tooltip>
      </div>

      <div className="flex flex-wrap sm:flex-nowrap items-center justify-end gap-2 w-full">
  {/* Show Data From Section */}
  <div className="flex flex-col items-start gap-1 min-w-0">
    <span className="text-[9px] sm:text-xs text-gray-500 italic shrink-0">
      Show Data From
    </span>
    <input
      type="date"
      value={showFromDate}
      onChange={(e) => setShowFromDate(e.target.value)}
      min={dateFilter.min}
      max={dateFilter.max}
      className="border border-gray-500 rounded p-0.5 text-xs w-[70px] sm:w-[150px] shrink-0"
    />
  </div>

  {/* Separator */}
  <span className="text-[9px] sm:text-xs text-gray-500 mt-3 italic shrink-0 hidden sm:block">
    to
  </span>

  {/* To Section */}
  <div className="flex flex-col items-start gap-1  min-w-0">
    <span className="text-[9px] sm:text-xs text-gray-500 italic shrink-0">
      To
    </span>
    <input
      type="date"
      value={showToDate}
      onChange={(e) => setShowToDate(e.target.value)}
      min={dateFilter.min}
      max={dateFilter.max}
      className="border border-gray-500 rounded p-0.5 text-xs w-[70px] sm:w-[150px] shrink-0"
    />
  </div>

  {/* Show Button */}
  <Button
    variant="contained"
    color="success"
    sx={{
      textTransform: "none",
      fontSize: { xs: 9, sm: 12 },
      padding: { xs: "3px 6px", sm: "8px 16px" },
      minWidth: { xs: "55px", sm: "70px" },
      height: { xs: "30px", sm: "auto" },
    }}
    onClick={handleFilterDataWithDate}
    className="shrink-0"
  >
    Show
  </Button>
</div>

    </div>
  );
};

export default ViewControllers;

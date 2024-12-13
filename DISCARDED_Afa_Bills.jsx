import React, { useEffect } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import AddIcon from "@mui/icons-material/Add";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import CreateBillDialog from "../../../components/Dialog/BillDailogs/CreateBillDialog";
import { useState } from "react";
import SnackBarAlert from "../../../components/Dialog/SnackBarAlert";
import TokenReverification from "../../../components/Dialog/TokenReverification";
import axios from "axios";
import {
  searchBillObjects,
  sortArrayByUpdatedAt,
} from "../../../utils/CustomUtilityFunctions";
import { Tooltip } from "@mui/material";
import { GrRefresh } from "react-icons/gr";
import BillPlaceholder from "../../../components/miscellaneous/BillPlaceholder";
import SweeperImage from "../../../components/Carousel/SweeperImage";
import BillAccordion from "../../../components/Accordion/BillAccordion";
import SkeletonLoader from "../../../components/Loaders/SkeletonLoader";

const Afa_Bills = () => {
  const skeletons = Array.from({ length: 6 }, (_, index) => (
    <SkeletonLoader key={index} />
  ));
  const [snackbarOpen, setSnackbarOpen] = useState({
    open: false,
    message: "",
    type: "success",
  });
  const [isDescending, setIsDescending] = useState(false);
  const [showTokenReverificationDialog, setShowTokenReverificationDialog] =
    useState(false);
  const [showCreateBillDialog, setShowCreateBillDialog] = useState(false);
  const [showSweeper, setShowSweeper] = useState(false);
  const [sweeperImageList, setSweeperImageList] = useState([]);
  const [loader, setLoader] = useState(false);
  const [bills, setBills] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFilteredArrayToggle, setSearchFilteredArrayToggle] =
    useState(false);
  const [foundSearches, setFoundSearches] = useState([]);

  // accordion controls
  const [uniqueInvoiceDates, setUniqueInvoiceDates] = useState([]);

  const downloadImage = (imageName) => {
    fetch(`${import.meta.env.VITE_API_URL}/billImage/${imageName}`)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", imageName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  };

  const fetchBills = () => {
    setLoader(true);
    axios
      .get(`${import.meta.env.VITE_API_URL}/billRepository`, {
        headers: {
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem("AFA_user")).token
          }`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log("then", response);
        setBills(sortArrayByUpdatedAt(response.data, isDescending));
        let temp = [];
        response.data.forEach((element) => {
          if (!temp.includes(element.invoiceDate.split("T")[0])) {
            temp.push(element.invoiceDate.split("T")[0]);
          }
        });
        setUniqueInvoiceDates(temp);
        setLoader(false);
      })
      .catch((error) => {
        console.error("catch", error);
        if (error.code === "ERR_NETWORK") {
          setSnackbarOpen({
            open: true,
            message: "Error 503: Server is down",
            type: "error",
          });
          return;
        } else if (error?.response?.data.message === "jwt expired") {
          setShowTokenReverificationDialog(true);
        } else {
          setSnackbarOpen({
            open: true,
            message: error.response.data.message,
            type: "error",
          });
        }
        setLoader(false);
      });
  };

  useEffect(() => {
    fetchBills();
  }, []);

  useEffect(() => {
    if (searchQuery === "") {
      setSearchFilteredArrayToggle(false);
    } else {
      setSearchFilteredArrayToggle(true);
      console.log(searchBillObjects(bills, searchQuery));
      setFoundSearches(searchBillObjects(bills, searchQuery));
    }
  }, [searchQuery]);

  return (
    <>
      {loader ? (
        <div className="mt-[100px] w-screen flex flex-col items-center justify-center gap-3 py-5 px-10">
          {skeletons}
        </div>
      ) : (
        <>
          <div className="w-screen min-h-screen pb-5 flex flex-col">
            <div className="w-full flex items-center justify-between gap-4 sticky top-0 left-0 bg-white px-8 md:px-20 pt-[100px] pb-10 shadow shadow-gray-300">
              <TextField
                label="Search"
                variant="standard"
                type="search"
                placeholder="Search..."
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="end">
                      <SearchOutlinedIcon />
                    </InputAdornment>
                  ),
                  autoComplete: "off",
                }}
                sx={{ width: "25rem" }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="flex justify-center items-center gap-7">
                <Button
                  startIcon={<AddIcon />}
                  variant="contained"
                  color="success"
                  size="large"
                  onClick={() => setShowCreateBillDialog(true)}
                >
                  <span className="hidden md:block">Create new bills</span>
                  <span className="block md:hidden">new</span>
                </Button>
                <Tooltip title="Refresh">
                  <div
                    onClick={() => {
                      fetchBills();
                    }}
                  >
                    <GrRefresh className="text-xl font-semibold cursor-pointer" />
                  </div>
                </Tooltip>
              </div>
            </div>
            {searchFilteredArrayToggle ? (
              <div className="w-full">
                {foundSearches.length ? (
                  <>
                    <div className="w-full text-xl md:text-2xl font-semibold px-8 md:px-20 mt-6 md:mt-10">
                      {foundSearches.length} search(s) found for your query.
                    </div>
                    <div className="w-full flex flex-col items-center justify-center gap-3 mt-6 md:mt-10 px-8 md:px-20">
                      <BillAccordion
                        uniqueInvoiceDates={uniqueInvoiceDates}
                        bills={foundSearches}
                      />
                    </div>
                  </>
                ) : (
                  <BillPlaceholder fetchBills={fetchBills} />
                )}
              </div>
            ) : (
              <div className="w-full">
                {bills.length ? (
                  <div className="w-full flex flex-col items-center justify-center gap-3 mt-6 md:mt-10 px-8 md:px-20">
                    <BillAccordion
                      uniqueInvoiceDates={uniqueInvoiceDates}
                      bills={bills}
                    />
                  </div>
                ) : (
                  <BillPlaceholder fetchBills={fetchBills} />
                )}
              </div>
            )}
          </div>
          {showCreateBillDialog && (
            <CreateBillDialog
              setShowCreateBillDialog={setShowCreateBillDialog}
              setSnackbarOpen={setSnackbarOpen}
              setShowTokenReverificationDialog={
                setShowTokenReverificationDialog
              }
              fetchBills={fetchBills}
            />
          )}
          <SnackBarAlert
            snackbarOpen={snackbarOpen}
            setSnackbarOpen={setSnackbarOpen}
          />
          {showTokenReverificationDialog && (
            <TokenReverification
              setShowTokenReverificationDialog={
                setShowTokenReverificationDialog
              }
            />
          )}
        </>
      )}
    </>
  );
};

export default Afa_Bills;

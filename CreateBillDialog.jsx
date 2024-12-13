import React, { useState } from "react";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import OnlyImageCapture from "../../../components/CameraCaptures/OnlyImageCapture";
import ImageWithZoom from "../../../components/miscellaneous/ImageWithZoom";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import DeleteIcon from "@mui/icons-material/Delete";
import { TextField } from "@mui/material";
import axios from "axios";
import CircularLoader from "../../Loaders/CircularLoader";

const CreateBillDialog = ({
  setShowCreateBillDialog,
  setSnackbarOpen,
  setShowTokenReverificationDialog,
  fetchBills,
}) => {
  const [loading, setLoading] = useState(false);
  const [invoiceDate, setInvoiceDate] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [cameraRoll, setCameraRoll] = useState([]);
  const [showImageCapturer, setShowImageCapturer] = useState(false);
  const handleCapture = () => {
    setShowImageCapturer(true);
  };
  const assignImageToCameraRoll = (src) => {
    setCameraRoll([...cameraRoll, src]);
  };

  const handleSubmit = () => {
    if (invoiceDate === "") {
      setSnackbarOpen({
        open: true,
        message: "Invoice Date cannot be empty",
        type: "warning",
      });
    } else if (invoiceNumber === "") {
      setSnackbarOpen({
        open: true,
        message: "Invoice Number cannot be empty",
        type: "warning",
      });
    } else if (!cameraRoll.length) {
      setSnackbarOpen({
        open: true,
        message: "No bill(s) image captured",
        type: "warning",
      });
    } else {
      const data = {
        invInvoiceDate: invoiceDate,
        invInvoiceNo: invoiceNumber,
        images: cameraRoll,
      };
      console.log(data);
      setLoading(true);
      axios
        .post(
          `${import.meta.env.VITE_API_URL}/billRepository/create`,
          JSON.stringify(data),
          {
            headers: {
              Authorization: `Bearer ${
                JSON.parse(localStorage.getItem("AFA_user")).token
              }`,
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          console.log("then", response);
          setLoading(false);
          setSnackbarOpen({
            open: true,
            message: "New Invoice created successfully",
            type: "success",
          });
          setShowCreateBillDialog(false);
          fetchBills();
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
          setLoading(false);
        });
    }
  };
  return (
    <>
      <div className="fixed top-0 left-0 w-screen h-screen pt-[65px] flex justify-center items-center backdrop-blur-lg">
        <div className="bg-white rounded w-full h-full md:w-[90%] md:h-[90%] flex flex-col justify-between items-center border shadow-md shadow-gray-500">
          <div className="uppercase w-full py-4 px-3 border-b border-gray-300 text-2xl font-bold">
            Create new afa bill
          </div>
          <div className="h-full w-full pb-4 overflow-y-auto">
            <div className="sticky top-0 left-0 w-full py-2 pb-3 md:py-4 px-4 md:px-10 flex flex-col md:flex-row gap-4 md:flex-wrap items-center justify-center md:justify-end lg:justify-between bg-white z-[80] shadow md:shadow-md shadow-gray-400">
              <TextField
                variant="standard"
                label="Invoice Number"
                sx={{ width: "30%", minWidth: "15rem" }}
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
              />
              <TextField
                type="date"
                variant="standard"
                label="Date"
                InputLabelProps={{
                  shrink: true,
                }}
                sx={{ width: "30%", minWidth: "15rem" }}
                value={invoiceDate}
                onChange={(e) => setInvoiceDate(e.target.value)}
              />
              <Button
                variant="contained"
                color="success"
                startIcon={<CameraAltIcon />}
                onClick={handleCapture}
                disabled={cameraRoll.length >= 2}
                sx={{ width: "30%", minWidth: "15rem" }}
              >
                Capture
              </Button>
            </div>
            {cameraRoll.length ? (
              <div className="flex justify-start items-center gap-2 px-3 py-4 pt-4 md:pt-7 w-full flex-wrap">
                {cameraRoll.map((camImg, index) => (
                  <div key={index}>
                    <div className="bg-transparent w-full flex justify-end -mb-3 ml-5">
                      <IconButton
                        color="error"
                        onClick={() => {
                          setCameraRoll(cameraRoll.filter((c) => c !== camImg));
                        }}
                        size="large"
                      >
                        <DeleteIcon size="inherit" />
                      </IconButton>
                    </div>
                    <div className="max-w-[18rem]">
                      <ImageWithZoom src={camImg} alt="bills" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="w-full flex flex-col justify-start pt-8 md:pt-16 items-center gap-1 md:gap-3">
                <span className="text-center italic text-lg font-semibold">
                  No image(s) captured yet.
                </span>
                <span className="text-center w-[70%]">
                  Click on the 'Capture' button at the top to capture more bills
                </span>
              </div>
            )}
          </div>
          <div className="w-full py-4 px-3 flex justify-center items-center gap-3 border-t border-gray-300">
            <Button
              variant="outlined"
              color="error"
              fullWidth
              size="large"
              onClick={() => {
                setShowCreateBillDialog(false);
              }}
            >
              cancel
            </Button>
            <Button
              variant="contained"
              fullWidth
              size="large"
              onClick={handleSubmit}
            >
              save
            </Button>
          </div>
        </div>
      </div>
      {loading && <CircularLoader />}
      {showImageCapturer && (
        <OnlyImageCapture
          imageToggler={() => setShowImageCapturer(false)}
          assignImageFunc={assignImageToCameraRoll}
        />
      )}
    </>
  );
};

export default CreateBillDialog;

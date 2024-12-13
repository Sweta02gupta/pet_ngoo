import React, { useState } from "react";
import axios from "axios";
import { BsCameraReelsFill } from "react-icons/bs";
import { InputAdornment, TextField } from "@mui/material";
import CircularLoader from "../Loaders/CircularLoader";
import ReleaseCapture from "../CameraCaptures/ReleaseCapture";
import SnackBarAlert from "./SnackBarAlert";
import CustomInputField from "../CustomFields/CustomInputField";
import CustomTextareaField from "../CustomFields/CustomTextareaField";

const ForceCaseCloseDialogCatR = ({
  fetchAllTransaction,
  currentModification,
  showForceCloseDialog,
  setShowForceCloseDialog,
  statusList,
  setShowTokenReverificationDialog,
}) => {
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState({
    open: false,
    message: "",
    type: "success",
  });

  const [imgSrc, setImgSrc] = useState(null);
  const [toggler, setToggler] = useState(false);
  const [geoLoc, setGeoLoc] = useState(null);

  const [closeCaseData, setCloseCaseData] = useState({
    date: "",
    remarks: "",
  });

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        const base64String = reader.result.split(",")[1];
        resolve(base64String);
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    fileToBase64(file)
      .then((base64String) => {
        // Do something with the base64String
        console.log(`data:image/png;base64,${base64String}`);
        setImgSrc(`data:image/png;base64,${base64String}`);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleSubmit = () => {
    if (closeCaseData.date === "") {
      setSnackbarOpen({
        open: true,
        message: "Release Date is mandatory",
        type: "warning",
      });
    } else {
      let data = {
        afaStatusId: statusList.filter((s) => s.StatusName === "released")[0]
          .id,
        afaReleaseDate: closeCaseData.date,
      };
      if (imgSrc) {
        data = {
          ...data,
          afaReleaseImg: imgSrc,
        };
      }
      if (closeCaseData.remarks === "" && !imgSrc) {
        setSnackbarOpen({
          open: true,
          message: "Remarks are mandatory if an Image is not provided",
          type: "warning",
        });
        return;
      }
      if (closeCaseData.remarks !== "") {
        data = {
          ...data,
          afaRemark: "FORCED CLOSED-" + closeCaseData.remarks,
        };
      }
      console.log(data);
      setLoading(true);
      axios
        .put(
          `${
            import.meta.env.VITE_API_URL
          }/api/v2/rescue/cat/update/forceRelease/${currentModification.id}`,
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
          if (response.status === 200) {
            setSnackbarOpen({
              open: true,
              message: "Release Successful",
              type: "success",
            });
            setShowForceCloseDialog(false);
            fetchAllTransaction();
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
      {loading && <CircularLoader />}
      <div className="mt-[40px] fixed top-0 left-0 w-screen h-screen flex flex-col justify-center items-center bg-black bg-opacity-70">
        <div className="bg-white rounded-xl w-[95%] lg:w-[60%] flex flex-col justify-between items-center max-h-full overflow-y-auto">
          <span
            className="w-full px-10 py-2 md:py-5 border-b border-gray-300 
          text-lg md:text-xl font-semibold text-center"
          >
            Force closing: {currentModification.FileNo}
          </span>
          <div className="w-full px-10 flex flex-col justify-center items-center gap-3 py-8">
            <CustomInputField
              label="Case closed on"
              type="date"
              id="closeDate"
              value={closeCaseData.date}
              onChange={(e) =>
                setCloseCaseData({
                  ...closeCaseData,
                  date: e.target.value,
                })
              }
            />
            <CustomTextareaField
              label="Remarks (optional)"
              id="remarks"
              rows={2}
              value={closeCaseData.remarks}
              onChange={(e) =>
                setCloseCaseData({
                  ...closeCaseData,
                  remarks: e.target.value,
                })
              }
            />
            <div className="w-full rounded flex justify-center items-center">
              {toggler ? (
                <ReleaseCapture
                  setGeoLoc={setGeoLoc}
                  setToggler={setToggler}
                  setImgSrc={setImgSrc}
                />
              ) : (
                <>
                  {imgSrc ? (
                    <img
                      src={imgSrc}
                      alt="img"
                      className="object-cover rounded w-[15rem] md:w-[25rem]"
                    />
                  ) : (
                    <div className="bg-gray-100 w-[60%] h-full flex justify-center items-center rounded py-8">
                      <BsCameraReelsFill className="text-5xl md:text-8xl text-gray-600" />
                    </div>
                  )}
                </>
              )}
            </div>
            <div className="flex w-full justify-center items-center gap-3">
              <div
                className="w-[80%] bg-blue-600 text-white font-semibold text-xl text-center py-2 rounded hover:bg-blue-700 transition cursor-pointer"
                onClick={() => setToggler((prev) => !prev)}
              >
                CAPTURE PHOTO
              </div>
              <label
                className="w-[80%] bg-green-600 text-white font-semibold text-xl text-center py-2 rounded hover:bg-green-700 transition cursor-pointer"
                htmlFor="admImgUpload"
              >
                UPLOAD PHOTO
              </label>
              <input
                type="file"
                accept="image/*"
                hidden
                id="admImgUpload"
                name="admImgUpload"
                onChange={handleFileChange}
              />
            </div>
            <div className="flex w-full my-3 items-center justify-center gap-5">
              <div
                className="w-full text-center py-2 border rounded-full bg-red-400 hover:bg-red-500 text-white transition cursor-pointer text-lg"
                onClick={() => {
                  setShowForceCloseDialog((prev) => !prev);
                }}
              >
                Cancel
              </div>
              <div
                className="w-full text-center py-2 border rounded-full bg-green-400 hover:bg-green-500 text-white transition cursor-pointer text-lg"
                onClick={handleSubmit}
              >
                Save
              </div>
            </div>
          </div>
        </div>
        <SnackBarAlert
          snackbarOpen={snackbarOpen}
          setSnackbarOpen={setSnackbarOpen}
        />
      </div>
    </>
  );
};

export default ForceCaseCloseDialogCatR;

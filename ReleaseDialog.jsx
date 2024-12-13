import React, { useState } from "react";
import { Button, MenuItem, TextField } from "@mui/material";
import ReleaseCapture from "../CameraCaptures/ReleaseCapture";
import { BsCameraReelsFill } from "react-icons/bs";
import SnackBarAlert from "./SnackBarAlert";
import CircularLoader from "../Loaders/CircularLoader";
import axios from "axios";
import ReleaseLocErrorDialogBox from "./ReleaseLocErrorDialogBox";

const ReleaseDialog = ({
  statusList,
  currentModification,
  setShowReleaseDialog,
  fetchAllTransaction,
  modifierType,
}) => {
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState({
    open: false,
    message: "",
    type: "success",
  });
  const [releaseLocErrorModal, setReleaseLocErrorModal] = useState(false);
  const [trapReleaseDistance, setTrapReleaseDistance] = useState("100");
  const [imgSrc, setImgSrc] = useState(null);
  const [toggler, setToggler] = useState(false);
  const [geoLoc, setGeoLoc] = useState(null);
  const [modifiedStatus, setModifiedStatus] = useState({
    remarks: "",
    newStatus:
      modifierType === "trapper"
        ? statusList.filter((status) => status.StatusName === "released")[0].id
        : "",
  });

  const generateCurrentDate = () => {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, "0");
    let mm = String(today.getMonth() + 1).padStart(2, "0");
    let yyyy = today.getFullYear();
    let currentDate = dd + "-" + mm + "-" + yyyy;
    return currentDate;
  };

  const handleSubmit = () => {
    if (modifiedStatus.newStatus === "" || !imgSrc) {
      setSnackbarOpen({
        open: true,
        message:
          "A new status and release image are mandatory. Kindly check whether you have provided all necessary details.",
        type: "warning",
      });
    } else {
      if (modifierType === "trapper") {
        setLoading(true);
        const data = {
          afaStatusId: statusList.filter(
            (st) => st.StatusName === "released"
          )[0].id,
          afaReleaseLocation: geoLoc,
          afaReleaseDate: generateCurrentDate(),
          afaReleaseImg: imgSrc,
        };
        if (modifiedStatus.remarks.length) {
          data["afaRemark"] = modifiedStatus.remarks;
        }
        console.log(data);
        axios
          .put(
            `${
              import.meta.env.VITE_API_URL
            }/api/v2/transaction/sterilization/dog/update/release/${
              currentModification.id
            }`,
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
                message: "Status Changed successfully",
                type: "success",
              });
              setShowReleaseDialog((prev) => !prev);
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
            } else if (error.response.status === 409) {
              setTrapReleaseDistance(error.response.data.message.split(" ")[2]);
              setReleaseLocErrorModal((prev) => !prev);
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
      } else if (modifierType === "admin") {
        setLoading(true);
        const data = {
          afaNewStatusId: modifiedStatus.newStatus,
          afaNewStatusDate: generateCurrentDate(),
        };
        if (imgSrc) {
          data["afaNewTrnImg"] = imgSrc;
        }
        if (modifiedStatus.remarks.length) {
          data["afaRemark"] = modifiedStatus.remarks;
        }
        console.log(data);
        axios
          .put(
            `${
              import.meta.env.VITE_API_URL
            }/api/v2/transaction/sterilization/dog/update/transactionStatus/${
              currentModification.id
            }`,
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
                message: "Status Changed successfully",
                type: "success",
              });
              setShowReleaseDialog((prev) => !prev);
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
            } else if (error.response.status === 409) {
              setTrapReleaseDistance(error.response.data.message.split(" ")[2]);
              setReleaseLocErrorModal((prev) => !prev);
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
    }
  };
 // const surgeryCompleted = currentModification.surgeryCompleted;
 const filterStatuses = () => {
  const currentStatus = currentModification.StatusName.toLowerCase();
  const surgeryCompleted = currentModification.surgeryCompleted;

  console.log("Current Status:", currentStatus);
  console.log("Surgery Completed:", surgeryCompleted);

  const statusOptions = {
    surgery: ["released", "deceased", "sick"],
    trapped: surgeryCompleted
      ? ["sick", "deceased", "released"]
      : ["sick", "deceased", "released", "surgery", "release without surgery"],
    sick: surgeryCompleted
      ? ["deceased", "released"]
      : ["surgery", "release without surgery", "deceased", "released"],
    released: [],
    "release without surgery": [],
    deceased: [],
  };
  

  return statusOptions[currentStatus] || [];
};

  
  return (
    <>
      {loading && <CircularLoader />}
      {releaseLocErrorModal ? (
        <ReleaseLocErrorDialogBox
          setReleaseLocErrorModal={setReleaseLocErrorModal}
          fileNo={currentModification?.FileNo}
          trapReleaseDistance={trapReleaseDistance}
        />
      ) : (
        <div className="fixed top-5 left-0 w-screen h-screen flex flex-col justify-center items-center bg-black bg-opacity-70">
          <div className="bg-white rounded-xl w-[95%] lg:w-[60%] flex flex-col justify-between items-center max-h-full overflow-y-auto">
            <span className="w-full px-10 py-5 border-b border-gray-300 text-base md:text-xl font-semibold text-center">
              {currentModification?.FileNo}
            </span>
            <div className="w-full px-10 flex flex-col justify-center items-center gap-3">
              {modifierType === "admin" ? (
                 <TextField
                 select
                 defaultValue=""
                 label="Changing status to"
                 fullWidth
                 variant="standard"
                 sx={{ mt: 2 }}
                 value={modifiedStatus.newStatus}
                 onChange={(e) =>
                   setModifiedStatus({...modifiedStatus, newStatus: e.target.value,
                   })
                 }
               >
         {statusList
  .filter((status) => {
    const validStatuses = filterStatuses().map((status) => status.toLowerCase());
    return validStatuses.includes(status.StatusName.toLowerCase());
  })
  .sort((a, b) => a.StatusName.localeCompare(b.StatusName))
  .map((option) => (
    <MenuItem key={option.id} value={option.id}>
      {`${option.StatusName.charAt(0).toUpperCase()}${option.StatusName.slice(1).toLowerCase()}`}
    </MenuItem>
  ))}


               </TextField>
               
              ) : (
                <TextField
                  label="Changing status to"
                  variant="standard"
                  sx={{ mt: 2 }}
                  fullWidth
                  value={"Released"}
                  disabled
                />
              )}
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
                        className="object-cover rounded w-[20rem] md:w-[25rem]"
                      />
                    ) : (
                      <div className="bg-gray-100 w-[60%] h-full flex justify-center items-center rounded py-14">
                        <BsCameraReelsFill className="text-5xl md:text-8xl text-gray-600" />
                      </div>
                    )}
                  </>
                )}
              </div>
              <div
                className="w-full bg-blue-600 text-white font-semibold text-xl text-center py-2 rounded hover:bg-blue-700 transition"
                onClick={() => setToggler((prev) => !prev)}
              >
                TAKE PHOTO
              </div>
              <TextField
                label="Remarks (optional)"
                multiline
                minRows={2}
                maxRows={3}
                variant="standard"
                fullWidth
                sx={{ my: 3 }}
                value={modifiedStatus.remarks}
                onChange={(e) =>
                  setModifiedStatus({
                    ...modifiedStatus,
                    remarks: e.target.value,
                  })
                }
              />
              <div className="flex w-full mb-3 items-center justify-center gap-5">
                <div
                  className="w-full text-center py-2 border rounded-full bg-red-400 hover:bg-red-500 text-white transition cursor-pointer text-lg"
                  onClick={() => {
                    setShowReleaseDialog((prev) => !prev);
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
      )}
    </>
  );
};

export default ReleaseDialog;

import React, { useState } from "react";
import SnackBarAlert from "../SnackBarAlert";
import CircularLoader from "../../Loaders/CircularLoader";
import axios from "axios";
import ReleaseCapture from "../../CameraCaptures/ReleaseCapture";
import { BsCameraReelsFill } from "react-icons/bs";
import CustomSelectField from "../../CustomFields/CustomSelectField";
import { generateCurrentDate } from "../../../utils/CustomUtilityFunctions";

const SickDecDialog = ({
  fetchAllTransaction,
  currentModification,
  showSickDecDialog,
  setShowSickDecDialog,
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

  const [newStatus, setNewStatus] = useState("");

  const handleSubmit = () => {
    if (newStatus === "") {
      setSnackbarOpen({
        open: true,
        message: "Status cannot be empty",
        type: "warning",
      });
    } else if (!imgSrc) {
      setSnackbarOpen({
        open: true,
        message: "Image is not captured",
        type: "warning",
      });
    } else {
      setLoading(true);
      const data = {
        StatusId: newStatus,
        SickDate: generateCurrentDate(),
        SickImg: imgSrc,
      };
      console.log(data);
      axios
        .put(
          `${import.meta.env.VITE_API_URL}/transaction/catUpdate/${
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
            setShowSickDecDialog(false);
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
          <span className="w-full px-10 py-5 border-b border-gray-300 text-xl font-semibold text-center">
            {currentModification.FileNo}
          </span>
          <div className="w-full px-10 flex flex-col justify-center items-center gap-3">
            <CustomSelectField
              label="Changing Status to"
              labelSelector="StatusName"
              id="newStatus"
              options={statusList.filter(
                (s) => s.StatusName === "sick" || s.StatusName === "deceased"
              )}
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
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
              className="w-[80%] bg-blue-600 text-white font-semibold text-xl text-center py-2 rounded hover:bg-blue-700 transition cursor-pointer"
              onClick={() => setToggler((prev) => !prev)}
            >
              CAPTURE PHOTO
            </div>
            <div className="flex w-full my-3 items-center justify-center gap-5">
              <div
                className="w-full text-center py-2 border rounded-full bg-red-400 hover:bg-red-500 text-white transition cursor-pointer text-lg"
                onClick={() => {
                  setShowSickDecDialog((prev) => !prev);
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

export default SickDecDialog;

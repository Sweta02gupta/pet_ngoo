import React, { useState } from "react";
import SnackBarAlert from "../SnackBarAlert";
import CircularLoader from "../../Loaders/CircularLoader";
import axios from "axios";
import CustomInputField from "../../CustomFields/CustomInputField";
import ReleaseCapture from "../../CameraCaptures/ReleaseCapture";
import { BsCameraReelsFill } from "react-icons/bs";
import ReleaseLocErrorDialogBox from "../ReleaseLocErrorDialogBox";

const ReleaseCatDialog = ({
  showReleaseDialog,
  setShowReleaseDialog,
  statusList,
  currentModification,
  fetchAllTransaction,
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
  const [releaseLocErrorModal, setReleaseLocErrorModal] = useState(false);
  const [trapReleaseDistance, setTrapReleaseDistance] = useState("100");

  const generateCurrentDate = () => {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, "0");
    let mm = String(today.getMonth() + 1).padStart(2, "0");
    let yyyy = today.getFullYear();
    let currentDate = dd + "-" + mm + "-" + yyyy;
    return currentDate;
  };

  const handleSubmit = () => {
    if (!imgSrc) {
      setSnackbarOpen({
        open: true,
        message: "RELEASE IMAGE NOT FOUND",
        type: "warning",
      });
    } else if (!geoLoc) {
      setSnackbarOpen({
        open: true,
        message: "RELEASE LOCATION NOT FOUND",
        type: "warning",
      });
    } else {
      setLoading(true);
      const data = {
        ReleaseDate: generateCurrentDate(),
        ReleaseLocation: geoLoc,
        StatusId: statusList.filter(
          (status) => status.StatusName === "released"
        )[0].id,
        ReleaseImg: imgSrc,
      };
      console.log(data);
      axios
        .put(
          `${import.meta.env.VITE_API_URL}/transaction/catUpdate/Release/${
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
            setShowReleaseDialog(false);
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
        <div className="mt-[40px] fixed top-0 left-0 w-screen h-screen flex flex-col justify-center items-center bg-black bg-opacity-70">
          <div className="bg-white rounded-xl w-[95%] lg:w-[60%] flex flex-col justify-between items-center max-h-full overflow-y-auto">
            <span className="w-full px-10 py-5 border-b border-gray-300 text-xl font-semibold text-center">
              {currentModification.FileNo}
            </span>
            <div className="w-full px-10 flex flex-col justify-center items-center gap-3">
              <CustomInputField
                label="Changing the current status to"
                id="release"
                value="RELEASED"
                onChange={() => {}}
                disabled
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

export default ReleaseCatDialog;

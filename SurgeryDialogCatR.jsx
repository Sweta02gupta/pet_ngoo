import React, { useState } from "react";
import axios from "axios";
import { BsCameraReelsFill } from "react-icons/bs";
import CustomInputField from "../CustomFields/CustomInputField";
import ReleaseCapture from "../CameraCaptures/ReleaseCapture";
import SnackBarAlert from "./SnackBarAlert";
import CircularLoader from "../Loaders/CircularLoader";

const SurgeryDialogCatR = ({
  setShowSurgeryDialog,
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

  const [neuteringData, setNeuteringData] = useState({
    datePerformed: "",
  });

  const [imgSrc, setImgSrc] = useState(null);
  const [toggler, setToggler] = useState(false);
  const [geoLoc, setGeoLoc] = useState(null);

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
    if (neuteringData.datePerformed === "") {
      setSnackbarOpen({
        open: true,
        message: "TREATMENT DATE NOT FOUND",
        type: "warning",
      });
    } else if (!imgSrc) {
      setSnackbarOpen({
        open: true,
        message: "TREATMENT IMAGE NOT FOUND",
        type: "warning",
      });
    } else {
      setLoading(true);
      const data = {
        afaStatusId: statusList.filter((st) => st.StatusName === "treatment")[0]
          .id,
        afaVetId: JSON.parse(localStorage.getItem("AFA_user")).userId,
        afaTreatmentDate: neuteringData.datePerformed,
        afaTreatmentImg: imgSrc,
      };
      console.log(data);
      axios
        .put(
          `${
            import.meta.env.VITE_API_URL
          }/api/v2/rescue/cat/update/treatment/${
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
            fetchAllTransaction();
            setShowSurgeryDialog(false);
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
            <CustomInputField
              label="Changing the current status to"
              id="neutering"
              value="Treatment"
              onChange={() => {}}
              disabled
            />
            <CustomInputField
              label="Treatment Date"
              type="date"
              id="neuteringDate"
              value={neuteringData.datePerformed}
              onChange={(e) =>
                setNeuteringData({
                  ...neuteringData,
                  datePerformed: e.target.value,
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
            <div className="flex w-full justify-center items-center gap-3">
              <div
                className="w-[80%] bg-blue-600 text-white font-semibold text-xl text-center py-2 rounded hover:bg-blue-700 transition cursor-pointer"
                onClick={() => setToggler((prev) => !prev)}
              >
                CAPTURE PHOTO
              </div>
              <label
                className="w-[80%] bg-green-600 text-white font-semibold text-xl text-center py-2 rounded hover:bg-green-700 transition cursor-pointer"
                htmlFor="neutImgUpload"
              >
                UPLOAD PHOTO
              </label>
              <input
                type="file"
                accept="image/*"
                hidden
                id="neutImgUpload"
                name="neutImgUpload"
                onChange={handleFileChange}
              />
            </div>
            <div className="flex w-full my-3 items-center justify-center gap-5">
              <div
                className="w-full text-center py-2 border rounded-full bg-red-400 hover:bg-red-500 text-white transition cursor-pointer text-lg"
                onClick={() => {
                  setShowSurgeryDialog((prev) => !prev);
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

export default SurgeryDialogCatR;

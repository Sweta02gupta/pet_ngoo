import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Button,
  CircularProgress,
  TextField,
  Modal,
} from "@mui/material";
import QrCodeScannerIcon from "@mui/icons-material/QrCode";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { locationIcon, routeIcon } from "../../assets";
import ImageWithZoom from "../miscellaneous/ImageWithZoom";
import {
  AiFillCheckCircle,
  AiFillCloseCircle,
  AiOutlineStop,
} from "react-icons/ai";
import { useState, useEffect } from "react";
import { BsInfo } from "react-icons/bs";
import axios from "axios";
import { MdEdit } from "react-icons/md";
import QRCode from "react-qr-code";
import CryptoJS from "crypto-js";

const CatAccordian = ({
  index,
  expanded,
  handleAccordionCollapse,
  trap,
  setCurrentModification,
  setShowReleaseDialog,
  setShowForceCloseDialog,
  setShowCmtUpdDialog,
  decodeStatusTextColor,
  decodeStatus,
  fetchAllTransaction,
  setSnackbarOpen,
  setShowTokenReverificationDialog,
  isTrapper,
  isVetView,
  setShowSurgeryDialog = () => {},
}) => {
  const [fetchImage, setFetchImage] = useState(false);
  const [weightLoader, setWeightLoader] = useState(false);
  const [weight, setWeight] = useState("");
  const [toggleWeight, setToggleWeight] = useState(false);
  const [qrData, setQRData] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [animalType, setAnimalType] = useState("Cat");
  const [type, setType] = useState("Sterilization");
  const handleWeightChange = (e) => {
    const inputRegex = /^[0-9.]*$/; // Regular expression to match numbers and decimals
    const newValue = e.target.value;

    if (inputRegex.test(newValue)) {
      console.log(newValue);
      setWeight(newValue);
    }
  };

  const handleSaveWeight = () => {
    if (weight.length) {
      setWeightLoader(true);
      const payload = {
        afaWeight: parseFloat(weight).toString(),
      };
      console.log("payload", payload);
      axios
        .put(
          `${
            import.meta.env.VITE_API_URL
          }/api/v2/transaction/sterilization/cat/update/${trap.id}`,
          JSON.stringify(payload),
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
          } else {
            setSnackbarOpen({
              open: true,
              message: response.data.message,
              type: "error",
            });
          }
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
        })
        .finally(() => {
          setWeightLoader(true);
        });
    }
  };

  const handleWeightEdit = (currentWeight) => {
    setWeight(currentWeight);
    setToggleWeight(true);
  };

  useEffect(() => {
    if (trap) {
      // Encrypt data before setting as QR code value
      const encryptedData = encryptData({
        CaseNo: trap.CaseNo,
        FileNo: trap.FileNo,
        Animal: animalType,
        Type: type,
      });

      const jsonData = JSON.stringify({
        Text: import.meta.env.VITE_QR_PLACEHOLDER_TEXT,
        Data: encryptedData,
      });

      setQRData(jsonData);
    }
  }, [trap]);
  const encryptData = (data) => {
    // Convert data to string
    const jsonData = JSON.stringify(data);
    // Encrypt data using AES encryption
    const encrypted = CryptoJS.AES.encrypt(
      jsonData,
      `${import.meta.env.VITE_QR_SECRET_KEY}`
    ).toString();
    return encrypted;
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <Accordion
      expanded={expanded === `panel${index + 1}`}
      onChange={handleAccordionCollapse(`panel${index + 1}`)}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <div className="grid grid-cols-12 items-center gap-2">
          {/* Avatar or placeholder */}
          <div className="col-span-2">
            {trap.StatusName === "released" ||
            trap.StatusName === "release without surgery" ||
            trap.StatusName === "deceased" ? (
              fetchImage ? (
                <Avatar
                  src={`${import.meta.env.VITE_API_URL}/image/${
                    trap.ReleaseImg
                  }`}
                  alt="dog"
                />
              ) : (
                <Avatar>D</Avatar>
              )
            ) : (
              <Avatar
                src={`${import.meta.env.VITE_API_URL}/image/${trap.TrapImg}`}
                alt="dog"
              />
            )}
          </div>

          {/* File number */}
          <div className="col-span-6">
            <span className="tracking-tighter md:tracking-normal">
              {isTrapper
                ? trap.FileNo.replace(
                    "_" + JSON.parse(localStorage.getItem("AFA_user")).username,
                    ""
                  )
                : trap.FileNo}
            </span>
          </div>

          {/* Status Labels */}
          <div className="col-span-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
            {trap.StatusName === "release without surgery" && (
              <span className="text-xs text-yellow-500 font-bold border border-yellow-500 rounded-full text-center px-2 py-0.5 bg-yellow-50">
                RWS
              </span>
            )}
            {trap.StatusName === "released" && (
              <span className="text-xs text-green-500 font-bold border border-green-500 rounded-full text-center px-2 py-0.5 bg-green-50">
                Released
              </span>
            )}
            {trap.StatusName === "deceased" && (
              <span className="text-xs text-red-500 font-bold border border-red-500 rounded-full text-center px-2 py-0.5 bg-red-50">
                DECEASED
              </span>
            )}
          </div>
        </div>
      </AccordionSummary>

      <AccordionDetails className="flex flex-col gap-3">
        {!isVetView && (
          <div className="w-full flex justify-end items-center rounded-lg gap-4">
            {!isTrapper && (
              <div
                className="border rounded shadow p-2 text-center text-gray-500 hover:text-red-600 active:text-red-500 transition cursor-pointer"
                onClick={() => {
                  setCurrentModification(trap);
                  setShowForceCloseDialog(true);
                }}
              >
                <AiOutlineStop className="text-3xl" />
              </div>
            )}
            <div
              className="cursor-pointer"
              onClick={() =>
                window.open(
                  `https://www.google.com/maps/dir/?api=1&destination=${trap.TrapLocation.lat},${trap.TrapLocation.long}&dir_action=navigate`,
                  "_blank"
                )
              }
            >
              <img
                src={locationIcon}
                alt="location icon"
                className="w-7 md:w-10"
              />
            </div>
            <div
              className="cursor-pointer"
              onClick={() =>
                window.open(
                  `https://www.google.com/maps/search/?api=1&query=${trap.TrapLocation.lat},${trap.TrapLocation.long}&zoom=15&markers=${trap.TrapLocation.lat},${trap.TrapLocation.long}`,
                  "_blank"
                )
              }
            >
              <img src={routeIcon} alt="route icon" className="w-7 md:w-10" />
            </div>
            <div className="cursor-pointer" onClick={toggleModal}>
              <QrCodeScannerIcon />
            </div>
          </div>
        )}
        {fetchImage ? (
          <ImageWithZoom
            src={`${
              trap?.ReleaseImg
                ? `${import.meta.env.VITE_API_URL}/image/${trap.ReleaseImg}`
                : `${import.meta.env.VITE_API_URL}/image/${trap.TrapImg}`
            }`}
            alt="dog"
          />
        ) : (
          <div className="h-[15rem] w-full flex justify-center items-center">
            <Button
              variant="outlined"
              color="success"
              onClick={() => setFetchImage(true)}
              sx={{ fontSize: 20 }}
            >
              Download Image
            </Button>
          </div>
        )}
        <div
          className={`w-full ${decodeStatusTextColor(
            decodeStatus(trap.StatusId)
          )} flex justify-center items-center gap-1 text-xl md:text-3xl font-bold uppercase`}
        >
          {trap.StatusName}
        </div>
        <div className="flex flex-col justify-center items-center gap-4 w-full px-4 md:px-8 lg:px-16 xl:px-28 text-sm md:text-base">
          <div className="flex justify-between items-center w-full">
            <span>{trap.ReleaseDate ? trap.ReleaseDate : trap.TrapDate}</span>
            <p>{trap.username}</p>
          </div>
          <div className="flex justify-between items-center w-full">
            <p>{trap.NgoName}</p>
            <p className="capitalize">{trap.AreaName}</p>
          </div>
          <div className="flex justify-between items-center w-full">
            <p>{trap.ColorName}</p>
            <p className="capitalize">{trap.gender}</p>
          </div>
          <div className="flex flex-col gap-2 w-full">
            <p className="capitalize">Owner/Caretaker Name: {trap.ownerName}</p>
            <p className="capitalize">Owner Contact: {trap.ownerContact}</p>
          </div>
          {weightLoader ? (
            <div className="w-full">
              <CircularProgress size={20} />
            </div>
          ) : (
            <>
              {trap.Weight ? (
                <div className="w-full flex items-center gap-10">
                  {toggleWeight ? (
                    <div className="flex items-center">
                      <div className="flex border-2 border-slate-400 rounded pl-2">
                        <input
                          type="text"
                          placeholder="Enter Weight in KG"
                          className="outline-none my-1"
                          value={weight}
                          onChange={handleWeightChange}
                        />
                        <span className="text-xl bg-slate-200">KG</span>
                      </div>
                      <button
                        className="bg-green-600 text-white text-center px-2 py-1 rounded border mx-2"
                        onClick={handleSaveWeight}
                      >
                        Save
                      </button>
                      <button
                        className="bg-red-600 text-white text-center px-2 py-1 rounded border"
                        onClick={() => {
                          setToggleWeight(false);
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <>
                      <span>{trap.Weight}KGs</span>
                      <button
                        className="bg-red-600 text-white text-center p-1 rounded border"
                        onClick={() => handleWeightEdit(trap.Weight)}
                      >
                        <MdEdit />
                      </button>
                    </>
                  )}
                </div>
              ) : (
                <div className="w-full flex items-center gap-4">
                  <div className="flex border-2 border-slate-400 rounded pl-2">
                    <input
                      type="text"
                      placeholder="Enter Weight in KG"
                      className="outline-none my-1"
                      value={weight}
                      onChange={handleWeightChange}
                    />
                    <span className="text-xl bg-slate-200">KG</span>
                  </div>
                  <button
                    className="bg-red-600 text-white text-center p-2 rounded border"
                    onClick={handleSaveWeight}
                  >
                    Add Weight
                  </button>
                </div>
              )}
            </>
          )}

          <p className="w-full">LANDMARK: {trap.Landmark}</p>
          {trap?.Comment && trap.Comment.length > 0 && (
            <p className="tracking-tight leading-tight w-full text-blue-600 font-bold">
              COMMENT: {trap.Comment}
            </p>
          )}
          {/* Sick Section */}
          {trap.SickDate && trap.StatusName !== "sick" && (
            <div className="w-full flex flex-col justify-center items-center gap-2">
              <div className="w-full flex items-center justify-center text-green-600 uppercase text-lg font-bold">
                Sick
                <AiFillCheckCircle className="text-green-600 mx-2 text-2xl" />
                <div className="w-full h-[1px] bg-green-600" />
              </div>
              <div className="w-full">Date: {trap.SickDate}</div>
              {trap.SickImg ? (
                <ImageWithZoom
                  src={`${import.meta.env.VITE_API_URL}/image/${trap.SickImg}`}
                  alt="sick animal"
                />
              ) : (
                <p>No image available</p>
              )}
            </div>
          )}

          {/* Released Without Surgery */}
          {!trap.SurgeryDate &&
            trap.ReleaseDate &&
            trap.StatusName !== "deceased" && (
              <div className="w-full flex flex-col justify-center items-center gap-2">
                <div className="w-full flex items-center justify-center text-green-500 uppercase text-lg font-bold">
                  Released Without Surgery
                  <AiFillCheckCircle className="text-green-500 mx-2 text-2xl" />
                  <div className="w-full h-[1px] bg-green-500" />
                </div>
                <div className="w-full">Date: {trap.ReleaseDate}</div>
                {trap.ReleaseImg ? (
                  <ImageWithZoom
                    src={`${import.meta.env.VITE_API_URL}/image/${
                      trap.ReleaseImg
                    }`}
                    alt="released animal"
                  />
                ) : (
                  <p>No image available</p>
                )}
              </div>
            )}

          {/* Trapped Section */}
          {trap.TrapDate && trap.StatusName !== "trapped" && (
            <div className="w-full flex flex-col justify-center items-center gap-2">
              <div className="w-full flex items-center justify-center text-green-600 uppercase text-lg font-bold">
                Trapped
                <AiFillCheckCircle className="text-green-600 mx-2 text-2xl" />
                <div className="w-full h-[1px] bg-green-600" />
              </div>
              <div className="w-full">Date: {trap.TrapDate}</div>
              {trap.TrapImg ? (
                <ImageWithZoom
                  src={`${import.meta.env.VITE_API_URL}/image/${trap.TrapImg}`}
                  alt="trapped animal"
                />
              ) : (
                <p>No image available</p>
              )}
            </div>
          )}

          {/* Surgery Section */}
          {trap.SurgeryDate && trap.StatusName !== "surgery" && (
            <div className="w-full flex flex-col justify-center items-center gap-2">
              <div className="w-full flex items-center justify-center text-green-600 uppercase text-lg font-bold">
                Surgery
                <AiFillCheckCircle className="text-green-600 mx-2 text-2xl" />
                <div className="w-full h-[1px] bg-green-600" />
              </div>
              <div className="w-full">Date: {trap.SurgeryDate}</div>
              <ImageWithZoom
                src={`${import.meta.env.VITE_API_URL}/image/${trap.SurgeryImg}`}
                alt="surgery animal"
              />
            </div>
          )}

          {trap.StatusName !== "deceased" &&
            trap.StatusName !== "release without surgery" &&
            trap.StatusName !== "released" &&
            (!trap.SurgeryDate || !trap.ReleaseDate) && (
              <div className="flex flex-col w-full items-center justify-center">
                <div className="w-full flex items-center justify-center text-black uppercase text-lg font-bold">
                  Pending
                  <AiFillCloseCircle className="text-black mx-2 text-2xl" />
                  <div className="w-full h-[1px] bg-black" />
                </div>
                <div className="w-full flex flex-wrap items-center justify-start gap-2">
                  {!trap.SurgeryDate && (
                    <div className="flex items-center justify-center gap-2 text-red-600 border border-red-600 py-1 px-2 rounded-full bg-red-50">
                      Surgery <AiFillCloseCircle className="text-[15px]" />
                    </div>
                  )}
                  {!trap.ReleaseDate && (
                    <div className="flex items-center justify-center gap-2 text-red-600 border border-red-600 py-1 px-2 rounded-full bg-red-50">
                      Release <AiFillCloseCircle className="text-[15px]" />
                    </div>
                  )}
                </div>
              </div>
            )}

          {(!trap.SurgeryDate || !trap.ReleaseDate) && (
            <div className="flex flex-col w-full items-start justify-start">
              <div className="w-full flex flex-wrap items-start justify-start gap-2">
                {trap.SurgeryDate && trap.StatusName === "in surgery" && (
                  <div className="w-full flex flex-col justify-center items-center gap-2">
                    <div className="w-full flex items-center justify-center text-green-600 uppercase text-lg font-bold">
                      Surgery
                      <AiFillCheckCircle className="text-green-600 mx-2 text-2xl" />
                      <div className="w-full h-[1px] bg-green-600" />
                    </div>
                    <div className="w-full">Date: {trap.SurgeryDate}</div>
                    <ImageWithZoom
                      src={`${import.meta.env.VITE_API_URL}/image/${
                        trap.SurgeryImg
                      }`}
                      alt="cat"
                    />
                  </div>
                )}

                {trap.ReleaseDate && trap.StatusName === "released" && (
                  <div className="w-full flex flex-col justify-center items-center gap-2">
                    <div className="w-full flex items-center justify-center text-green-600 uppercase text-lg font-bold">
                      Released
                      <AiFillCheckCircle className="text-green-600 mx-2 text-2xl" />
                      <div className="w-full h-[1px] bg-green-600" />
                    </div>
                    <div className="w-full">Date: {trap.ReleaseDate}</div>
                    <ImageWithZoom
                      src={`${import.meta.env.VITE_API_URL}/image/${
                        trap.ReleaseImg
                      }`}
                      alt="cat"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {isTrapper ? (
            <>
              {!trap.ReleaseDate && trap.SurgeryDate && (
                <div
                  className="w-full flex justify-center items-center py-2 rounded bg-green-700 text-white text-xl cursor-pointer hover:bg-green-800 transition"
                  onClick={() => {
                    setCurrentModification(trap);
                    setShowReleaseDialog((prev) => !prev);
                  }}
                >
                  RELEASE
                </div>
              )}
            </>
          ) : (
            <>
              {isVetView ? (
                <>
                  {!trap.SurgeryDate && trap.Weight && (
                    <div
                      className="w-full flex justify-center items-center py-2 rounded bg-purple-700 text-white text-xl cursor-pointer hover:bg-purple-800 transition"
                      onClick={() => {
                        setCurrentModification(trap);
                        setShowSurgeryDialog((prev) => !prev);
                      }}
                    >
                      SURGERY
                    </div>
                  )}
                </>
              ) : (
                <>
                  {/* Only show Edit Comments button if status is not in restricted statuses */}
                  {!trap.ReleaseDate &&
                    ![
                      "released",
                      "release without surgery",
                      "deceased",
                    ].includes(trap.StatusName) && (
                      <div
                        className="w-full flex justify-center items-center py-2 rounded bg-purple-700 text-white text-xl cursor-pointer hover:bg-purple-800 transition"
                        onClick={() => {
                          setCurrentModification(trap);
                          setShowCmtUpdDialog((prev) => !prev);
                        }}
                      >
                        {trap?.Comment && trap.Comment.length
                          ? "EDIT COMMENTS"
                          : "ADD COMMENTS"}
                      </div>
                    )}

                  {/* Only show Change Status button if status is not in restricted statuses */}
                  {!trap.ReleaseDate &&
                    ![
                      "released",
                      "release without surgery",
                      "deceased",
                    ].includes(trap.StatusName) && (
                      <div
                        className="w-full flex justify-center items-center py-2 rounded bg-blue-700 text-white text-xl cursor-pointer hover:bg-blue-800 transition"
                        onClick={() => {
                          setCurrentModification(trap);
                          setShowReleaseDialog((prev) => !prev);
                        }}
                      >
                        CHANGE STATUS
                      </div>
                    )}
                </>
              )}
            </>
          )}
        </div>
      </AccordionDetails>
      <Modal open={isModalOpen} onClose={toggleModal}>
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg relative">
            <button
              onClick={toggleModal}
              className="absolute top-0 right-0 m-2 p-2 text-gray-600 hover:text-gray-800"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <QRCode className="m-5 p-1" value={qrData} size={200} />
          </div>
        </div>
      </Modal>
    </Accordion>
  );
};

export default CatAccordian;

import { useContext, useState } from "react";
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
} from "@mui/material";
import D_Box from "../../components/CreateFormBox/D_Box";
import TrapperCapture from "../../components/CameraCaptures/TrapperCapture";
import DogReviewBox from "../../components/ReviewBox/DogReviewBox";
import CircularLoader from "../../components/Loaders/CircularLoader";
import SnackBarAlert from "../../components/Dialog/SnackBarAlert";
import axios from "axios";
//import CustomDialogBox from "../../components/Dialog/CustomDialogBox";
import CustomDialogBoxR from "../../components/Dialog/CustomDialogBoxR";
import TokenReverification from "../../components/Dialog/TokenReverification";
import { AppContext } from "../../context/SuperProvider";
import { generateCurrentDate } from "../../utils/CustomUtilityFunctions";

const steps = ["", "", ""];

const Create_D_FormR = () => {
  // Loaders, alerts and Dialog togglers
  const [loading, setLoading] = useState(false);
  const [showTrapperSuccessDialog, setShowTrapperSuccessDialog] =
    useState(false);
  const [showTokenReverificationDialog, setShowTokenReverificationDialog] =
    useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState({
    open: false,
    message: "",
    type: "success",
  });

  // Capture toggler
  const [toggler, setToggler] = useState(true);

  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set());

  const [newCaseFileNumber, setNewCaseFileNumber] = useState(null);
  const { ngoList, areaList, colorList, statusList } = useContext(AppContext);

  const [areaDropDown, setAreaDropDown] = useState(null);

  // Form Inputs
  const [dogForm, setDogForm] = useState({
    trapperName: JSON.parse(localStorage.getItem("AFA_user")).username,
    color: "",
    trapDate: "",
    gender: "",
    ownerName: "",
    comment: "",
    area: "",
    areaLandmark: "",
    ngo: "",
    geoTag: {
      lat: 0,
      long: 0,
    },
    isOffline: false,
    ownerContact: "",
  });
  const [imgSrc, setImgSrc] = useState(null);

  const isStepOptional = (step) => {
    return false;
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const handleSubmit = () => {
    if (
      dogForm.color === "" ||
      dogForm.gender === "" ||
      dogForm.area === "" ||
      dogForm.ngo === ""
    ) {
      setSnackbarOpen({
        open: true,
        message: "Some fields are empty. Kindly fill them and then save.",
        type: "warning",
      });
    } else if (!imgSrc) {
      setSnackbarOpen({
        open: true,
        message: "A trap image is missing",
        type: "error",
      });
    } else if (dogForm.geoTag.lat === 0 || dogForm.geoTag.long === 0) {
      setSnackbarOpen({
        open: true,
        message: "Geolocation not found. Try capturing image again.",
        type: "error",
      });
    } else {
      setLoading(true);
      const data = {
        afaTrapperId: JSON.parse(localStorage.getItem("AFA_user")).userId,
        afaCategoryName: "dog",
        afaGender: dogForm.gender.toLowerCase(),
        afaAreaId: dogForm.area,
        afaNgoId: dogForm.ngo,
        afaStatusId: statusList.find((obj) => obj.StatusName === "trapped").id,
        afaTrapLocation: {
          lat: dogForm.geoTag.lat,
          long: dogForm.geoTag.long,
        },
        afaColorId: dogForm.color,
        afaTrapDate: dogForm.isOffline
          ? dogForm.trapDate
          : generateCurrentDate(),
        afaTrapImg: imgSrc,
      };

      if (dogForm.comment.length) {
        data["afaComment"] = dogForm.comment;
      }

      // Add ownerName only if it's not null
      if (dogForm.ownerName.trim() !== "") {
        data["afaOwnerName"] = dogForm.ownerName.trim();
      }

      if (dogForm.ownerContact.trim() !== "") {
        data["afaOwnerContact"] = dogForm.ownerContact.trim();
      }

      // Add landmark only if it's not null
      if (dogForm.areaLandmark.trim() !== "") {
        data["afaLandmark"] = dogForm.areaLandmark.trim();
      }

      console.log(data);
      axios
        .post(
          `${import.meta.env.VITE_API_URL}/api/v2/rescue/dog/create`,
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
            setNewCaseFileNumber(response.data?.fileNo);
            setShowTrapperSuccessDialog(true);
          } else {
            setSnackbarOpen({
              open: true,
              message: response.data.message,
              type: "error",
            });
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
      {toggler ? (
        <div className="mt-[65px] w-full p-5 md:py-8 md:px-[15rem] xl:px-[20rem]">
          <span className="font-quicksand tracking-wide font-semibold text-2xl">
            We're helping a{" "}
            <span className="text-yellow-800 brightness-200 font-bold text-2xl text-center">
              Dog!
            </span>
          </span>
          <Stepper activeStep={activeStep} sx={{ my: 2 }}>
            {steps.map((label, index) => {
              const stepProps = {};
              const labelProps = {};
              if (isStepOptional(index)) {
                labelProps.optional = (
                  <Typography variant="caption">Optional</Typography>
                );
              }
              if (isStepSkipped(index)) {
                stepProps.completed = false;
              }
              return (
                <Step key={index} {...stepProps}>
                  <StepLabel {...labelProps}>{label}</StepLabel>
                </Step>
              );
            })}
          </Stepper>
          {activeStep === steps.length ? (
            <DogReviewBox
              ngoList={ngoList}
              areaList={areaList}
              colorList={colorList}
              imgSrc={imgSrc}
              dogForm={dogForm}
              handleReset={handleReset}
              handleSubmit={handleSubmit}
            />
          ) : (
            <>
              <D_Box
                ngoList={ngoList}
                areaList={areaList}
                colorList={colorList}
                activeStep={activeStep + 1}
                toggler={toggler}
                setToggler={setToggler}
                imgSrc={imgSrc}
                setImgSrc={setImgSrc}
                dogForm={dogForm}
                setDogForm={setDogForm}
                setSnackbarOpen={setSnackbarOpen}
                areaDropDown={areaDropDown}
                setAreaDropDown={setAreaDropDown}
              />
              <Box sx={{ display: "flex", flexDirection: "row", pt: 5 }}>
                <Button
                  variant="outlined"
                  fullWidth
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  sx={{ mr: 1, fontSize: 20 }}
                >
                  Back
                </Button>
                <Box sx={{ flex: "1 1 auto" }} />
                {isStepOptional(activeStep) && (
                  <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                    Skip
                  </Button>
                )}

                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleNext}
                  sx={{ fontSize: 20 }}
                >
                  {activeStep === steps.length - 1 ? "Finish" : "Next"}
                </Button>
              </Box>
            </>
          )}
        </div>
      ) : (
        <TrapperCapture
          toggler={toggler}
          setToggler={setToggler}
          imgSrc={imgSrc}
          setImgSrc={setImgSrc}
          formSetter={setDogForm}
        />
      )}
      {loading && <CircularLoader />}
      <SnackBarAlert
        snackbarOpen={snackbarOpen}
        setSnackbarOpen={setSnackbarOpen}
      />
      {showTrapperSuccessDialog && (
        <CustomDialogBoxR newCaseFileNumber={newCaseFileNumber} />
      )}
      {showTokenReverificationDialog && (
        <TokenReverification
          setShowTokenReverificationDialog={setShowTokenReverificationDialog}
        />
      )}
    </>
  );
};

export default Create_D_FormR;

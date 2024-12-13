import React from "react";
import { PhotoCamera, CloudUploadRounded } from "@mui/icons-material";
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
  Switch,
} from "@mui/material";
import CustomInputField from "../CustomFields/CustomInputField";
import CustomSelectField from "../CustomFields/CustomSelectField";
import CustomTextareaField from "../CustomFields/CustomTextareaField";
import CustomAreaDropdown from "../CustomFields/CustomAreaDropdown";
import { convertToBase64 } from "../../utils/CustomUtilityFunctions";

const C_Box_R = ({
  activeStep,
  setToggler,
  imgSrc,
  setImgSrc,
  catForm,
  setCatForm,
  ngoList,
  areaList,
  colorList,
  setSnackbarOpen,
  areaDropDown,
  setAreaDropDown,
}) => {
  const handleFileUpload = async (event) => {
    const selectedFile = event.target.files[0];
    console.log(selectedFile.name);
    if (selectedFile.name.split("_")[0] !== "TRAPPED") {
      setSnackbarOpen({
        open: true,
        message: "ERROR: The image you have selected is wrong",
        type: "error",
      });
      return;
    }
    const geoTag = {
      lat: parseFloat(selectedFile.name.split("_")[1]),
      long: parseFloat(selectedFile.name.split("_")[2]),
    };
    const trapDate = selectedFile.name.split("_")[3].split(".").join("/");
    console.log(geoTag, trapDate);
    setCatForm({
      ...catForm,
      trapDate: trapDate,
      geoTag: geoTag,
    });
    const base64 = await convertToBase64(selectedFile);
    setImgSrc(`data:image/png;base64,${base64}`);
  };

  return (
    <Stack direction="column" spacing={5}>
      {activeStep === 1 && (
        <>
          <CustomInputField
            label="Trapper Name"
            id="trapperName"
            value={catForm.trapperName}
            onChange={() => {}}
            disabled
          />
          {imgSrc ? (
            <div className="w-full border h-[12rem] bg-gray-100 rounded">
              <img
                src={imgSrc}
                alt="capture"
                className="w-full h-full object-contain"
              />
            </div>
          ) : (
            <div className="w-full border h-[12rem] bg-gray-100 rounded flex flex-col items-center justify-center gap-3 font-quicksand text-gray-500">
              <PhotoCamera fontSize="large" />
              <span>Tap or click below to take a picture</span>
            </div>
          )}
          <div className="w-full flex flex-col justify-center items-start">
            <div className="w-full flex justify-start items-center gap-2 mb-5">
              <Switch
                checked={catForm.isOffline}
                size="large"
                onChange={(e) => {
                  setCatForm({
                    ...catForm,
                    isOffline: e.target.checked,
                  });
                }}
              />
              <span className="font-semibold text-xl">
                {catForm.isOffline ? "Switch to ONLINE" : "Switch to OFFLINE"}
              </span>
            </div>
            {catForm.isOffline ? (
              <label
                htmlFor="capUpload"
                className="flex items-center justify-center gap-4 text-white font-quicksand bg-orange-500 hover:bg-orange-600 active:bg-orange-600 transition py-4 w-full rounded-lg font-extrabold text-3xl tracking-wider"
              >
                <CloudUploadRounded fontSize="large" /> Upload
              </label>
            ) : (
              <button
                className="flex items-center justify-center gap-4 text-white font-quicksand bg-red-500 hover:bg-red-600 active:bg-red-600 transition py-4 w-full rounded-lg font-extrabold text-3xl tracking-wider"
                onClick={() => setToggler((prev) => !prev)}
              >
                <PhotoCamera fontSize="large" /> Take Photo
              </button>
            )}
          </div>
          <input
            type="file"
            accept=".jpg, .jpeg, .png"
            id="capUpload"
            hidden
            onChange={handleFileUpload}
          />
        </>
      )}
      {activeStep === 2 && (
        <>
          <CustomSelectField
            label="Choose Color"
            labelSelector="ColorName"
            id="catColor"
            options={colorList.sort((a, b) => {
              if (a.ColorName < b.ColorName) {
                return -1;
              }
              if (a.ColorName > b.ColorName) {
                return 1;
              }
              return 0;
            })}
            value={catForm.color}
            onChange={(e) =>
              setCatForm({
                ...catForm,
                color: e.target.value,
              })
            }
          />
          <CustomInputField
            label="Owner/Caretaker Name (Optional)"
            id="ownerName"
            value={dogForm.ownerName}
            onChange={(e) =>
              setDogForm({
                ...dogForm,
                ownerName: e.target.value,
              })
            }
          ></CustomInputField>
          <FormControl>
            <FormLabel>Gender</FormLabel>
            <RadioGroup
              row
              value={catForm.gender}
              onChange={(e) =>
                setCatForm({
                  ...catForm,
                  gender: e.target.value,
                })
              }
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-around",
              }}
            >
              <FormControlLabel
                value="Male"
                control={
                  <Radio
                    sx={{
                      "& .MuiSvgIcon-root": {
                        fontSize: 35,
                      },
                    }}
                  />
                }
                label="Male"
              />
              <FormControlLabel
                value="Female"
                control={
                  <Radio
                    sx={{
                      "& .MuiSvgIcon-root": {
                        fontSize: 35,
                      },
                    }}
                  />
                }
                label="Female"
              />
            </RadioGroup>
          </FormControl>
          <CustomTextareaField
            label="Comment (optional)"
            id="catComment"
            rows={4}
            value={catForm.comment}
            onChange={(e) =>
              setCatForm({
                ...catForm,
                comment: e.target.value,
              })
            }
          />
        </>
      )}

      {activeStep === 3 && (
        <>
          <CustomAreaDropdown
            areaOptions={areaList.sort((a, b) => {
              if (a.AreaName < b.AreaName) {
                return -1;
              }
              if (a.AreaName > b.AreaName) {
                return 1;
              }
              return 0;
            })}
            formObj={catForm}
            setFormObj={setCatForm}
            areaDropDown={areaDropDown}
            setAreaDropDown={setAreaDropDown}
          />
          <CustomTextareaField
            label="Area Landmark (optional)"
            id="catArea"
            rows={4}
            value={catForm.areaLandmark}
            onChange={(e) =>
              setCatForm({
                ...catForm,
                areaLandmark: e.target.value,
              })
            }
          />
          <CustomSelectField
            label="Select NGO"
            labelSelector="NgoName"
            id="catNgo"
            options={ngoList.sort((a, b) => {
              if (a.NgoName < b.NgoName) {
                return -1;
              }
              if (a.NgoName > b.NgoName) {
                return 1;
              }
              return 0;
            })}
            value={catForm.ngo}
            onChange={(e) =>
              setCatForm({
                ...catForm,
                ngo: e.target.value,
              })
            }
          />
        </>
      )}
    </Stack>
  );
};

export default C_Box_R;

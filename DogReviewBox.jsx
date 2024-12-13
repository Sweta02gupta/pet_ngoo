import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";

const LabelText = ({ label, text, type }) => (
  <div className={`w-full flex items-${type} justify-start gap-2`}>
    <span className="text-base italic">{label}</span>
    {text === "-N/A-" ? (
      <span className="text-sm font-medium text-red-600 uppercase">
        Not Provided
      </span>
    ) : (
      <span className="text-xl font-semibold tracking-wide leading-relaxed">
        {text}
      </span>
    )}
  </div>
);

const DogReviewBox = ({
  ngoList,
  areaList,
  colorList,
  imgSrc,
  dogForm,
  handleReset,
  handleSubmit,
}) => {
  const [areaLabel, setAreaLabel] = useState("");
  const [colorLabel, setColorLabel] = useState("");
  const [ngoLabel, setNgoLabel] = useState("");

  useEffect(() => {
    const foundArea = areaList.find((obj) => obj.id === dogForm.area);
    const foundNgo = ngoList.find((obj) => obj.id === dogForm.ngo);
    const foundColor = colorList.find((obj) => obj.id === dogForm.color);
    if (foundArea) setAreaLabel(foundArea.AreaName);
    if (foundNgo) setNgoLabel(foundNgo.NgoName);
    if (foundColor) setColorLabel(foundColor.ColorName);
  }, []);

  return (
    <div className="w-full flex flex-col items-center justify-center gap-3">
      <span className="font-bold text-2xl tracking-wider">REVIEW</span>
      {imgSrc && (
        <img
          src={imgSrc}
          alt="capture"
          className="w-[25rem] md:w-[30rem] lg:w-[40rem] xl:w-[50rem] object-cover"
        />
      )}
      <LabelText
        label="Trapper Name:"
        text={dogForm.trapperName}
        type="center"
      />
      <LabelText
        label="Color:"
        text={dogForm.color.length ? colorLabel : "-N/A-"}
        type="center"
      />
      <LabelText
        label="Owner/ Caretaker Name:"
        text={dogForm.ownerName.length ? dogForm.ownerName : "-N/A-"}
        type="center"
      />
      <LabelText
        label="Owner Contact:"
        text={dogForm.ownerContact.length ? dogForm.ownerContact : "-N/A-"}
        type="center"
      />
      <LabelText
        label="Gender:"
        text={dogForm.gender.length ? dogForm.gender : "-N/A-"}
        type="center"
      />
      <LabelText
        label="NGO:"
        text={dogForm.ngo.length ? ngoLabel : "-N/A-"}
        type="center"
      />
      {dogForm.isOffline && (
        <LabelText
          label="Trapped Date"
          text={dogForm.trapDate.length ? dogForm.trapDate : "-N/A-"}
          type="center"
        />
      )}
      <LabelText
        label="Area:"
        text={dogForm.area.length ? areaLabel : "-N/A-"}
        type="center"
      />
      <LabelText
        label="Area Landmark:"
        text={dogForm.areaLandmark.length ? dogForm.areaLandmark : "-N/A-"}
        type="center"
      />

      <LabelText
        label="Comment:"
        text={dogForm.comment.length ? dogForm.comment : "-N/A-"}
        type="start"
      />
      <div className="w-full flex items-center justify-center gap-2">
        <Button
          onClick={handleReset}
          variant="outlined"
          fullWidth
          sx={{ fontSize: 16 }}
        >
          Edit
        </Button>
        <Button
          variant="contained"
          fullWidth
          sx={{ fontSize: 16 }}
          onClick={handleSubmit}
        >
          Save
        </Button>
      </div>
    </div>
  );
};

export default DogReviewBox;

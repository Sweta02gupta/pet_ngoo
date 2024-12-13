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

const CatReviewBox = ({
  ngoList,
  areaList,
  colorList,
  imgSrc,
  catForm,
  handleReset,
  handleSubmit,
}) => {
  const [areaLabel, setAreaLabel] = useState("");
  const [colorLabel, setColorLabel] = useState("");
  const [ngoLabel, setNgoLabel] = useState("");

  useEffect(() => {
    const foundArea = areaList.find((obj) => obj.id === catForm.area);
    const foundNgo = ngoList.find((obj) => obj.id === catForm.ngo);
    const foundColor = colorList.find((obj) => obj.id === catForm.color);
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
        text={catForm.trapperName}
        type="center"
      />
      <LabelText
        label="Color:"
        text={catForm.color.length ? colorLabel : "-N/A-"}
        type="center"
      />
      <LabelText
        label="Owner/ Caretaker Name:"
        text={catForm.ownerName.length ? catForm.ownerName : "-N/A-"}
        type="center"
      />
      <LabelText
        label="Owner Contact:"
        text={catForm.ownerContact.length ? catForm.ownerContact : "-N/A-"}
        type="center"
      />
      <LabelText
        label="Gender:"
        text={catForm.gender.length ? catForm.gender : "-N/A-"}
        type="center"
      />
      <LabelText
        label="NGO:"
        text={catForm.ngo.length ? ngoLabel : "-N/A-"}
        type="center"
      />
      {catForm.isOffline && (
        <LabelText
          label="Trapped Date"
          text={catForm.trapDate.length ? catForm.trapDate : "-N/A-"}
          type="center"
        />
      )}
      <LabelText
        label="Area:"
        text={catForm.area.length ? areaLabel : "-N/A-"}
        type="center"
      />
      <LabelText
        label="Area Landmark:"
        text={catForm.areaLandmark.length ? catForm.areaLandmark : "-N/A-"}
        type="center"
      />
      <LabelText
        label="Comment:"
        text={catForm.comment.length ? catForm.comment : "-N/A-"}
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

export default CatReviewBox;

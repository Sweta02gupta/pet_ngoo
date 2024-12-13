import React from "react";

const ReleaseLocErrorDialogBox = ({
  setReleaseLocErrorModal,
  fileNo,
  trapReleaseDistance,
}) => {
  return (
    <div className="fixed top-0 left-0 w-screen h-screen flex flex-col justify-center items-center bg-black bg-opacity-70">
      <div className="bg-white text-black border border-red-500 w-[90%] max-w-[30rem] rounded-lg flex flex-col justify-center items-center pt-2 gap-3">
        <span className="w-full text-red-500 text-2xl flex flex-col items-start justify-center font-medium border-b border-red-200 px-3 pb-2">
          <b>ERROR:</b>{" "}
          <span>
            You are trying to release the animal {trapReleaseDistance} meters
            away from the <b>TRAP LOCATION</b>
          </span>
        </span>
        <p className="text-xl leading-relaxed px-7 text-justify">
          File No: <b>{fileNo}</b> could not be released here. Try reaching to
          the area where it was TRAPPED
        </p>
        <div className="w-full border-t border-red-200 flex items-center justify-end p-3">
          <div
            className="text-center text-xl font-semibold text-blue-500 cursor-pointer"
            onClick={() => setReleaseLocErrorModal((prev) => !prev)}
          >
            Cancel
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReleaseLocErrorDialogBox;

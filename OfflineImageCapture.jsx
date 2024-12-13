import React, { useState } from "react";
import { MdWarning } from "react-icons/md";
import OfflineCapture from "../../components/CameraCaptures/OfflineCapture";

const OfflineImageCapture = () => {
  const [toggleCapture, setToggleCapture] = useState(true);
  const [captureType, setCaptureType] = useState("");
  return (
    <>
      {toggleCapture ? (
        <div className="mt-[65px] w-screen h-[80vh] flex justify-center items-center">
          <div className="rounded-lg flex flex-col justify-center items-center gap-3 p-10 max-w-[50rem]">
            <MdWarning
              className="text-yellow-500 
            text-[3rem] md:text-[4rem]"
            />
            <p className="text-justify text-sm">
              The offline capture component is intended for use when network
              connectivity is poor. Its purpose is to capture an image and
              assign it a unique name that should not be altered. Once captured,
              the image will be saved automatically and should not be deleted,
              moved, or shared via other media devices such as WhatsApp.
            </p>
            <div className="w-full flex flex-col items-center justify-center gap-10 mt-5">
              <div
                className="bg-green-600 text-white border transition text-center text-xl rounded-xl cursor-pointer w-full py-3"
                onClick={() => {
                  setCaptureType("TRAPPED");
                  setToggleCapture((prev) => !prev);
                }}
              >
                Take Photo for TRAPPING
              </div>
              <div
                className="bg-violet-600 text-white border transition text-center text-xl rounded-xl cursor-pointer w-full py-3"
                onClick={() => {
                  setCaptureType("RELEASED");
                  setToggleCapture((prev) => !prev);
                }}
              >
                Take Photo for RELEASE
              </div>
            </div>
          </div>
        </div>
      ) : (
        <OfflineCapture
          captureType={captureType}
          setToggleCapture={setToggleCapture}
        />
      )}
    </>
  );
};

export default OfflineImageCapture;

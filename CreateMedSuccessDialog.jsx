import React from "react";

const CreateMedSuccessDialog = ({ createMoreFunc, navigateToViewFun }) => {
  return (
    <div className="pt-[40px] fixed z-[500] top-0 left-0 w-screen h-screen flex flex-col justify-center items-center bg-black bg-opacity-70">
      <div className="w-[90%] max-w-[23rem] bg-white text-black rounded flex flex-col items-center">
        <div className="border-b border-gray-400 w-full p-2 text-center text-xl font-semibold">
          MEDICINE CREATED SUCCESSFULLY
        </div>
        <div className="w-full flex flex-col justify-center p-2 pb-0">
          <div className="text-center p-4">
            Medicine has been created successfully. Press 'View' below to view
            all medicines.
          </div>
        </div>
        <div className="w-full flex gap-4 items-center justify-between p-4">
          <div
            className="w-full text-center py-2 text-lg rounded border border-green-400 text-green-400 hover:bg-green-50 transition font-medium cursor-pointer"
            onClick={createMoreFunc}
          >
            Create More
          </div>
          <div
            className="w-full text-center py-2 text-lg rounded text-white bg-green-400 hover:bg-green-500 transition font-medium cursor-pointer"
            onClick={navigateToViewFun}
          >
            View
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateMedSuccessDialog;

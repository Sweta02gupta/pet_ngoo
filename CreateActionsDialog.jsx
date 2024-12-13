import { Button } from "@mui/material";

const CreateActionsDialog = ({ backBtnFunc, createBtnFunc, updateBtnFunc }) => {
  return (
    <div className="pt-[40px] fixed z-[500] top-0 left-0 w-screen h-screen flex flex-col justify-center items-center bg-black bg-opacity-70">
      <div className="w-[90%] max-w-[26rem] bg-white text-black rounded flex flex-col items-center">
        <div className="border-b border-gray-400 w-full p-2 text-center text-xl font-semibold">
          MEDICINE ALREADY EXISTS
        </div>
        <div className="w-full flex flex-col justify-center p-2 pb-0">
          <div className="text-center p-4">
            This medicine already exists. Do you want to update the existing
            medicine or create a new one with the same data?
          </div>
        </div>
        <div className="w-full flex gap-4 items-center justify-center p-4">
          <Button variant="contained" color="success" onClick={createBtnFunc}>
            Create
          </Button>
          <Button variant="contained" color="primary" onClick={updateBtnFunc}>
            Update
          </Button>
          <Button variant="contained" color="error" onClick={backBtnFunc}>
            Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateActionsDialog;

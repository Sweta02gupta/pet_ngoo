import { CircularProgress } from "@mui/material";
import React from "react";

const CircularLoader = () => {
  return (
    <div className="fixed bg-black bg-opacity-70 flex justify-center items-center w-screen h-screen top-0 left-0 z-[200]">
      <CircularProgress />
    </div>
  );
};

export default CircularLoader;

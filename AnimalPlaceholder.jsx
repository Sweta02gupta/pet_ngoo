import React from "react";
import { AiOutlineReload } from "react-icons/ai";

const AnimalPlaceholder = ({ fetchAllTransaction }) => (
  <div
    className="w-full h-[20vh] font-semibold flex 
  flex-col justify-center items-center gap-2 text-lg"
  >
    No animals saved yet to show.
    <div
      className="cursor-pointer flex flex-col justify-center items-center gap-1 text-sm"
      onClick={() => {
        fetchAllTransaction();
      }}
    >
      <AiOutlineReload className="text-blue-500 text-2xl font-extrabold" />
      Try Again
    </div>
  </div>
);

export default AnimalPlaceholder;

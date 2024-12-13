import React from "react";
import { AiOutlineReload } from "react-icons/ai";

const BillPlaceholder = ({ fetchBills }) => (
  <div
    className="w-full h-[20vh] font-semibold flex 
  flex-col justify-center items-center gap-2 text-lg"
  >
    No Bill(s) saved yet to show.
    <div
      className="cursor-pointer flex flex-col justify-center items-center gap-1 text-sm"
      onClick={() => {
        fetchBills();
      }}
    >
      <AiOutlineReload className="text-blue-500 text-2xl font-extrabold" />
      Try Again
    </div>
  </div>
);

export default BillPlaceholder;

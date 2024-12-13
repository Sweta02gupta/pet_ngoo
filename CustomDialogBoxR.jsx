import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const CustomDialogBoxR = ({ newCaseFileNumber }) => {
  const navigate = useNavigate();
  const [userRoles, setUserRoles] = useState({});
  useEffect(() => {
    const roles = JSON.parse(localStorage.getItem("AFA_user")).role;
    setUserRoles({ roles: roles });
    console.log(userRoles);
  }, []);
  return (
    <div className="w-screen h-screen fixed top-0 left-0 bg-black bg-opacity-70 flex justify-center items-center text-black">
      <div className="border border-white rounded-xl w-[20rem] min-h-[18rem] md:w-[30rem] md:min-h-[20rem] bg-white flex flex-col justify-between items-center p-3 md:p-8">
        <span className="text-center w-full text-blue-700 brightness-150 text-3xl font-semibold md:text-5xl">
          🎉Hooray!🎉
        </span>
        <span className="italic text-center w-full text-lg">
          You've helped save a stressed animal!{" "}
          <br className="hidden md:block" />
          Together, we can make a difference and ensure a brighter future for
          our planet's precious wildlife.
          <br />
          {newCaseFileNumber && (
            <span className="my-2 flex items-center justify-center text-base gap-1">
              <span className="text-start">New File No:</span>
              <b className="text-start">{newCaseFileNumber}</b>
            </span>
          )}
        </span>
        <div className="w-full flex items-center justify-between">
          <div
            className="border border-white rounded-full bg-orange-500 cursor-pointer hover:bg-orange-600 transition text-white text-lg font-semibold text-center py-2 px-4"
            onClick={() => navigate("/user/TrapperRescueForm")}
          >
            Save More
          </div>
          <div
            className="border border-white rounded-full bg-green-500 cursor-pointer hover:bg-green-600 transition text-white text-lg font-semibold text-center py-2 px-6"
            onClick={() => {
              userRoles.roles.includes("ViewAdmin")
                ? navigate("/user/ViewRescueAdmin")
                : navigate("/user/ViewRescueTrapper");
            }}
          >
            View
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomDialogBoxR;

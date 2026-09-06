import React from "react";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import SecurityUpdateIcon from "@mui/icons-material/SecurityUpdate";
import { Avatar } from "@mui/material";
import Data from "./Data";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Body = () => {
  const user = useSelector((state) => state.superAdmin.authData);
  const result = user?.result || {};
  const navigate = useNavigate();
  return (
    <div className="flex-[0.8] mt-3">
      <div className="space-y-5">
        <div className="flex  items-center justify-between mr-8">
          <div className="flex space-x-2 text-gray-400">
            <AssignmentIndIcon />
            <h1>Profile</h1>
          </div>
          <div
            onClick={() => navigate("/superadmin/update")}
            className="flex space-x-2 cursor-pointer">
            <SecurityUpdateIcon />
            <h1 className="font-bold">Update</h1>
          </div>
        </div>
        <div className="w-[98%] bg-white relative rounded-xl ">
          <div className="absolute left-[50%] top-[-10%]">
            <Avatar src={result.avatar} sx={{ width: 70, height: 70 }} />
          </div>
          <div className="flex flex-col space-y-8 py-8 md:ml-10 md:flex-row md:space-x-40 md:space-y-0 md:py-10">
            <div className="flex flex-col space-y-6 md:space-y-10">
              <Data label="Name" value={result.name} />
              <Data label="Email" value={result.email} />
              <Data label="Username" value={result.username} />
            </div>
            <div className="flex flex-col space-y-6 md:space-y-10 ">
              <Data label="Contact Number" value={result.contactNumber} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Body;

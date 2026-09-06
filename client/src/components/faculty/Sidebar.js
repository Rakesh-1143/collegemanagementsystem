import React, { useState } from "react";
import HomeIcon from "@mui/icons-material/Home";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import AddIcon from "@mui/icons-material/Add";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import GradingIcon from "@mui/icons-material/Grading";
import { SidebarGroup, SidebarLink } from "../common/SidebarNav";

const Sidebar = () => {
  const [openGroup, setOpenGroup] = useState("Overview");

  const handleToggle = (title) => {
    setOpenGroup(openGroup === title ? null : title);
  };

  return (
    <div className="w-full space-y-6 py-2">
      <SidebarGroup title="Overview" isOpen={openGroup === "Overview"} onToggle={() => handleToggle("Overview")}>
        <SidebarLink to="/faculty/home" icon={HomeIcon} label="Dashboard" />
        <SidebarLink to="/faculty/profile" icon={AssignmentIndIcon} label="Profile" />
      </SidebarGroup>

      <SidebarGroup title="Academics" isOpen={openGroup === "Academics"} onToggle={() => handleToggle("Academics")}>
        <SidebarLink to="/faculty/mysubjects" icon={AssignmentIndIcon} label="My Subjects" />
        <SidebarLink to="/faculty/mystudents" icon={HowToRegIcon} label="My Students" />
        <SidebarLink to="/faculty/createtest" icon={AddIcon} label="Create Test" />
        <SidebarLink to="/faculty/uploadmarks" icon={GradingIcon} label="Upload Marks" />
        <SidebarLink to="/faculty/markattendance" icon={HowToRegIcon} label="Mark Attendance" />
      </SidebarGroup>
    </div>
  );
};

export default Sidebar;
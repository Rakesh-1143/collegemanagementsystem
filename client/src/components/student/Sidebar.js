import React, { useState } from "react";
import HomeIcon from "@mui/icons-material/Home";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { SidebarGroup, SidebarLink } from "../common/SidebarNav";

const Sidebar = () => {
  const [openGroup, setOpenGroup] = useState("Overview");

  const handleToggle = (title) => {
    setOpenGroup(openGroup === title ? null : title);
  };

  return (
    <div className="w-full space-y-6 py-2">
      <SidebarGroup title="Overview" isOpen={openGroup === "Overview"} onToggle={() => handleToggle("Overview")}>
        <SidebarLink to="/student/home" icon={HomeIcon} label="Dashboard" />
        <SidebarLink to="/student/profile" icon={AssignmentIndIcon} label="Profile" />
      </SidebarGroup>

      <SidebarGroup title="Academics" isOpen={openGroup === "Academics"} onToggle={() => handleToggle("Academics")}>
        <SidebarLink to="/student/testresult" icon={FactCheckIcon} label="Test Results" />
        <SidebarLink to="/student/attendance" icon={CalendarMonthIcon} label="Attendance" />
        <SidebarLink to="/student/subjectlist" icon={MenuBookIcon} label="Subject List" />
      </SidebarGroup>
    </div>
  );
};

export default Sidebar;
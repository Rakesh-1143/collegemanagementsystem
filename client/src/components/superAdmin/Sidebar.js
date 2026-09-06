import React, { useState } from "react";
import HomeIcon from "@mui/icons-material/Home";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import CampaignIcon from "@mui/icons-material/Campaign";
import EngineeringIcon from "@mui/icons-material/Engineering";
import AddIcon from "@mui/icons-material/Add";
import BoyIcon from "@mui/icons-material/Boy";
import DeleteIcon from "@mui/icons-material/Delete";
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
        <SidebarLink to="/superadmin/home" icon={HomeIcon} label="Dashboard" />
        <SidebarLink to="/superadmin/profile" icon={AssignmentIndIcon} label="Profile" />

        <div className="my-2 border-t border-[#464f5d]" />

        <SidebarLink to="/superadmin/addadmin" icon={AddIcon} label="Add Admin" />
        <SidebarLink to="/superadmin/manageadmin" icon={AssignmentIndIcon} label="Manage Admins" />
        <SidebarLink to="/superadmin/deleteadmin" icon={DeleteIcon} label="Remove Admin" />

        <div className="my-2 border-t border-[#464f5d]" />

        <SidebarLink to="/superadmin/adddepartment" icon={AddIcon} label="Add Department" />
        <SidebarLink to="/superadmin/managedepartment" icon={MenuBookIcon} label="Manage Departments" />
      </SidebarGroup>
    </div>
  );
};

export default Sidebar;

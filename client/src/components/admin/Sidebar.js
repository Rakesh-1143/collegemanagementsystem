import React, { useState } from "react";
import HomeIcon from "@mui/icons-material/Home";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import CampaignIcon from "@mui/icons-material/Campaign";
import EngineeringIcon from "@mui/icons-material/Engineering";
import AddIcon from "@mui/icons-material/Add";
import BoyIcon from "@mui/icons-material/Boy";
import DeleteIcon from "@mui/icons-material/Delete";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { useLocation } from "react-router-dom";
import { SidebarGroup, SidebarLink, SidebarSubGroup } from "../common/SidebarNav";

const Sidebar = () => {
  const location = useLocation();

  const getInitialGroup = () => {
    const path = location.pathname.toLowerCase();
    if (path.includes("createnotice")) return "Communication";
    if (path.includes("branch") || path.includes("course")) return "Curriculum";
    if (path.includes("faculty") || path.includes("student") || path.includes("subject")) return "Academics";
    return "Overview";
  };

  const [openGroup, setOpenGroup] = useState(getInitialGroup());

  const handleToggle = (title) => {
    setOpenGroup(openGroup === title ? null : title);
  };

  const path = location.pathname.toLowerCase();

  return (
    <div className="w-full space-y-6 py-2">
      <SidebarGroup title="Overview" isOpen={openGroup === "Overview"} onToggle={() => handleToggle("Overview")}>
        <SidebarLink to="/admin/home" icon={HomeIcon} label="Dashboard" />
        <SidebarLink to="/admin/profile" icon={AssignmentIndIcon} label="Profile" />
      </SidebarGroup>

      <SidebarGroup title="Communication" isOpen={openGroup === "Communication"} onToggle={() => handleToggle("Communication")}>
        <SidebarLink to="/admin/createnotice" icon={CampaignIcon} label="Create Notice" />
      </SidebarGroup>

      <SidebarGroup title="Curriculum" isOpen={openGroup === "Curriculum"} onToggle={() => handleToggle("Curriculum")}>
        <SidebarLink to="/admin/allbranch" icon={MenuBookIcon} label="Manage Branches" />
        <SidebarLink to="/admin/addbranch" icon={AddIcon} label="Add Branch" />
        <SidebarLink to="/admin/allcourse" icon={MenuBookIcon} label="Manage Courses" />
        <SidebarLink to="/admin/addcourse" icon={AddIcon} label="Add Course" />
      </SidebarGroup>

      <SidebarGroup title="Academics" isOpen={openGroup === "Academics"} onToggle={() => handleToggle("Academics")}>
        <SidebarSubGroup title="Faculty" defaultOpen={path.includes("faculty")}>
          <SidebarLink to="/admin/allfaculty" icon={EngineeringIcon} label="Faculty Directory" />
          <SidebarLink to="/admin/addfaculty" icon={AddIcon} label="Add Faculty" />
          <SidebarLink to="/admin/deletefaculty" icon={DeleteIcon} label="Remove Faculty" />
        </SidebarSubGroup>
        
        <SidebarSubGroup title="Student" defaultOpen={path.includes("student")}>
          <SidebarLink to="/admin/allstudent" icon={BoyIcon} label="Student Directory" />
          <SidebarLink to="/admin/addstudent" icon={AddIcon} label="Add Student" />
          <SidebarLink to="/admin/deletestudent" icon={DeleteIcon} label="Remove Student" />
        </SidebarSubGroup>
        
        <SidebarSubGroup title="Subjects" defaultOpen={path.includes("subject")}>
          <SidebarLink to="/admin/allsubject" icon={MenuBookIcon} label="Subjects" />
          <SidebarLink to="/admin/addsubject" icon={AddIcon} label="Add Subject" />
          <SidebarLink to="/admin/deletesubject" icon={DeleteIcon} label="Remove Subject" />
        </SidebarSubGroup>
      </SidebarGroup>
    </div>
  );
};

export default Sidebar;
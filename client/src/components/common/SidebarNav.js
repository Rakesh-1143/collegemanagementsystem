import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

const linkBase =
  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150";
const isNotActiveStyle = `${linkBase} text-slate-500 hover:bg-slate-100 hover:text-slate-800`;
const isActiveStyle = `${linkBase} bg-violet-600 text-white shadow-sm`;

export const SidebarLink = ({ to, icon: Icon, label }) => (
  <NavLink
    to={to}
    end={to.split("/").length === 3}
    className={({ isActive }) => (isActive ? isActiveStyle : isNotActiveStyle)}>
    <Icon sx={{ fontSize: 20 }} className="shrink-0" />
    <span className="truncate">{label}</span>
  </NavLink>
);

export const SidebarGroup = ({ title, children, isOpen, onToggle }) => {
  const [internalIsOpen, setInternalIsOpen] = useState(true);
  
  const isControlled = isOpen !== undefined;
  const currentlyOpen = isControlled ? isOpen : internalIsOpen;

  const handleToggle = () => {
    if (isControlled && onToggle) {
      onToggle();
    } else {
      setInternalIsOpen(!internalIsOpen);
    }
  };

  return (
    <div className="space-y-1">
      <button
        onClick={handleToggle}
        type="button"
        className="w-full flex items-center justify-between px-3 pb-1 text-left cursor-pointer group hover:bg-slate-50 rounded transition-colors"
      >
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-slate-600 transition-colors">
          {title}
        </span>
        {currentlyOpen ? (
          <ExpandLessIcon sx={{ fontSize: 16 }} className="text-slate-400 group-hover:text-slate-600" />
        ) : (
          <ExpandMoreIcon sx={{ fontSize: 16 }} className="text-slate-400 group-hover:text-slate-600" />
        )}
      </button>
      {currentlyOpen && <div className="space-y-1">{children}</div>}
    </div>
  );
};

export const SidebarSubGroup = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="space-y-1 mt-1">
      <button
        onClick={() => setIsOpen(!isOpen)}
        type="button"
        className="w-full flex items-center justify-between px-4 py-1.5 text-left cursor-pointer group hover:bg-slate-50 rounded transition-colors"
      >
        <span className="text-xs font-semibold text-slate-500 group-hover:text-slate-700 transition-colors capitalize">
          {title}
        </span>
        {isOpen ? (
          <ExpandLessIcon sx={{ fontSize: 16 }} className="text-slate-400 group-hover:text-slate-600" />
        ) : (
          <ExpandMoreIcon sx={{ fontSize: 16 }} className="text-slate-400 group-hover:text-slate-600" />
        )}
      </button>
      {isOpen && <div className="space-y-1 pl-4 border-l-2 border-slate-100 ml-4">{children}</div>}
    </div>
  );
};
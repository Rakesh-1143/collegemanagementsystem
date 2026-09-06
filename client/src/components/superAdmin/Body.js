import React from "react";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { useSelector } from "react-redux";
import StatCard from "../common/StatCard";

const Body = () => {
  const admins = useSelector((state) => state.superAdmin.admins?.result || []);
  
  const activeAdmins = admins.filter(admin => admin.isActive !== false).length;
  const inactiveAdmins = admins.length - activeAdmins;

  return (
    <div className="w-full space-y-6">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-slate-800">Super Admin Dashboard</h2>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:gap-4 xl:grid-cols-3">
        <StatCard
          icon={SupervisorAccountIcon}
          label="Total Admins"
          value={admins?.length || 0}
          color="orange"
        />
        <StatCard
          icon={CheckCircleIcon}
          label="Active Admins"
          value={activeAdmins}
          color="green"
        />
        <StatCard
          icon={CancelIcon}
          label="Inactive Admins"
          value={inactiveAdmins}
          color="red"
        />
      </div>
    </div>
  );
};

export default Body;

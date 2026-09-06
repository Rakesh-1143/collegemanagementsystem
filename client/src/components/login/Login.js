import React from "react";
import { Link } from "react-router-dom";
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import EngineeringIcon from '@mui/icons-material/Engineering';
import SchoolIcon from '@mui/icons-material/School';

const PortalCard = ({ title, to, icon: Icon, description }) => (
  <Link
    to={to}
    className="group relative flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm transition-all hover:border-indigo-500 hover:shadow-md"
  >
    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
      <Icon sx={{ fontSize: 32 }} />
    </div>
    <h3 className="mb-2 text-xl font-display font-semibold text-slate-800">{title}</h3>
    <p className="text-sm text-slate-500 font-medium">{description}</p>
    <div className="mt-6 flex h-10 w-full items-center justify-center rounded-lg bg-slate-50 text-sm font-medium text-slate-700 transition-colors group-hover:bg-indigo-50 group-hover:text-indigo-700">
      Access Portal
    </div>
  </Link>
);

const Login = () => {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-slate-50 p-6 sm:p-12">
      <div className="w-full max-w-5xl space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-sm">
            <SchoolIcon sx={{ fontSize: 36 }} />
          </div>
          <h1 className="text-3xl font-display font-bold text-slate-900 tracking-tight sm:text-4xl">
            College ERP
          </h1>
          <p className="text-lg text-slate-500 font-medium max-w-xl mx-auto">
            Select your portal to access the centralized management system.
          </p>
        </div>

        {/* Portal Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          <PortalCard 
            title="Super Admin" 
            to="/login/superadminlogin" 
            icon={AdminPanelSettingsIcon}
            description="System configuration and global management"
          />
          <PortalCard 
            title="Administrator" 
            to="/login/adminlogin" 
            icon={SupervisorAccountIcon}
            description="Manage departments, courses, and users"
          />
          <PortalCard 
            title="Faculty" 
            to="/login/facultylogin" 
            icon={EngineeringIcon}
            description="Manage attendance, marks, and classes"
          />
          <PortalCard 
            title="Student" 
            to="/login/studentlogin" 
            icon={SchoolIcon}
            description="View grades, attendance, and notices"
          />
        </div>
        
      </div>
    </div>
  );
};

export default Login;

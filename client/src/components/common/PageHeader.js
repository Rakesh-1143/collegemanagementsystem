import React from "react";

const PageHeader = ({ icon: Icon, title, subtitle, action }) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex min-w-0 items-center gap-4">
        {Icon && (
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-sm">
            <Icon sx={{ fontSize: 24 }} />
          </div>
        )}
        <div className="min-w-0">
          <h1 className="truncate text-xl font-display font-semibold text-slate-800 tracking-tight">{title}</h1>
          {subtitle && (
            <p className="truncate text-sm text-slate-500 font-medium mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
      {action}
    </div>
  );
};

export default PageHeader;
import React from "react";

const PageHeader = ({ icon: Icon, title, subtitle, action }) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex min-w-0 items-center gap-3">
        {Icon && (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
            <Icon sx={{ fontSize: 22 }} />
          </div>
        )}
        <div className="min-w-0">
          <h1 className="truncate text-lg font-bold text-slate-800">{title}</h1>
          {subtitle && (
            <p className="truncate text-sm text-slate-500">{subtitle}</p>
          )}
        </div>
      </div>
      {action}
    </div>
  );
};

export default PageHeader;
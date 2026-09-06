import React from "react";
import InboxIcon from "@mui/icons-material/Inbox";

const EmptyState = ({
  icon: Icon = InboxIcon,
  title = "Nothing here yet",
  hint,
}) => {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
      <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
        <Icon sx={{ fontSize: 30 }} />
      </div>
      <h3 className="text-base font-semibold text-slate-700">{title}</h3>
      {hint && (
        <p className="mt-1 max-w-xs text-sm text-slate-500">{hint}</p>
      )}
    </div>
  );
};

export default EmptyState;
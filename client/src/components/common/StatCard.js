import React from "react";

const colorClasses = {
  violet: "bg-violet-100 text-violet-700",
  blue: "bg-blue-100 text-blue-700",
  green: "bg-emerald-100 text-emerald-700",
  orange: "bg-orange-100 text-orange-700",
  pink: "bg-pink-100 text-pink-700",
  slate: "bg-slate-100 text-slate-600",
};

const StatCard = ({ icon: Icon, label, value, color = "violet" }) => {
  return (
    <div className="flex min-w-0 items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:p-5">
      {Icon && (
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
            colorClasses[color] || colorClasses.violet
          }`}>
          <Icon sx={{ fontSize: 26 }} />
        </div>
      )}
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          {label}
        </p>
        <p className="text-2xl font-bold text-slate-800">
          {value ?? "—"}
        </p>
      </div>
    </div>
  );
};

export default StatCard;
import React from "react";

const colorClasses = {
  indigo: "bg-indigo-50 text-indigo-600",
  blue: "bg-blue-50 text-indigo-600",
  green: "bg-emerald-50 text-emerald-600",
  orange: "bg-amber-50 text-amber-600",
  pink: "bg-pink-50 text-pink-600",
  slate: "bg-slate-50 text-slate-600",
};

const StatCard = ({ icon: Icon, label, value, color = "indigo" }) => {
  return (
    <div className="flex min-w-0 items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:border-slate-300">
      {Icon && (
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${
            colorClasses[color] || colorClasses.indigo
          }`}>
          <Icon sx={{ fontSize: 24 }} />
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
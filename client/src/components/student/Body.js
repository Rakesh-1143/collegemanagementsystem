import React, { useState } from "react";
import HomeIcon from "@mui/icons-material/Home";
import Calendar from "react-calendar";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import SchoolIcon from "@mui/icons-material/School";
import CampaignIcon from "@mui/icons-material/Campaign";
import "react-calendar/dist/Calendar.css";
import { useSelector } from "react-redux";
import Notice from "../notices/Notice";
import ShowNotice from "../notices/ShowNotice";
import PageHeader from "../common/PageHeader";
import StatCard from "../common/StatCard";
import EmptyState from "../common/EmptyState";

const Body = () => {
  const [openNotice, setOpenNotice] = useState(null);
  const notices = useSelector((state) => state.admin.notices.result);
  const testResult = useSelector((state) => state.student.testResult.result);
  const attendance = useSelector((state) => state.student.attendance.result);
  const user = useSelector((state) => state.student.authData);
  const subjects = useSelector((state) => state.admin.subjects.result);

  let totalAttendance = 0;
  attendance?.map((att) => (totalAttendance += att.attended));
  const name = user?.result?.name || "Student";

  return (
    <div className="w-full space-y-6">
      <PageHeader
        icon={HomeIcon}
        title="Dashboard"
        subtitle={`Welcome back, ${name}`}
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <StatCard
          icon={MenuBookIcon}
          label="Subjects"
          value={subjects?.length}
          color="violet"
        />
        <StatCard
          icon={FactCheckIcon}
          label="Tests Taken"
          value={testResult?.length}
          color="blue"
        />
        <StatCard
          icon={EventAvailableIcon}
          label="Classes Attended"
          value={totalAttendance}
          color="green"
        />
        <StatCard
          icon={SchoolIcon}
          label="Year"
          value={user?.result?.year}
          color="orange"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
          <Calendar className="!w-full !border-0" />
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5 xl:col-span-2">
          <div className="mb-4 flex items-center gap-2">
            <CampaignIcon className="text-violet-600" />
            <h2 className="text-lg font-bold text-slate-800">Notices</h2>
          </div>
          {!openNotice ? (
            <div className="max-h-[22rem] space-y-3 overflow-y-auto pr-1">
              {notices?.length ? (
                notices.map((notice, idx) => (
                  <div key={idx} onClick={() => setOpenNotice(notice)}>
                    <Notice idx={idx} notice={notice} notFor="faculty" />
                  </div>
                ))
              ) : (
                <EmptyState
                  title="No notices yet"
                  hint="New notices published by the admin will appear here."
                />
              )}
            </div>
          ) : (
            <div>
              <button
                type="button"
                onClick={() => setOpenNotice(null)}
                className="mb-3 text-sm font-semibold text-violet-600 hover:text-violet-800">
                ← Back to all notices
              </button>
              <ShowNotice notice={openNotice} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Body;
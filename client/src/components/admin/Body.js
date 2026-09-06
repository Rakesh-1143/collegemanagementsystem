import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import EngineeringIcon from "@mui/icons-material/Engineering";
import BoyIcon from "@mui/icons-material/Boy";
import CampaignIcon from "@mui/icons-material/Campaign";
import { useSelector } from "react-redux";
import Notice from "../notices/Notice";
import ShowNotice from "../notices/ShowNotice";
import StatCard from "../common/StatCard";
import EmptyState from "../common/EmptyState";

const Body = () => {
  const [openNotice, setOpenNotice] = useState(null);
  const notices = useSelector((state) => state.admin.notices.result);
  const students = useSelector((state) => state.admin.allStudent);
  const faculties = useSelector((state) => state.admin.allFaculty);

  return (
    <div className="w-full space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-2">
        <StatCard
          icon={EngineeringIcon}
          label="Faculty"
          value={faculties?.length}
          color="blue"
        />
        <StatCard
          icon={BoyIcon}
          label="Students"
          value={students?.length}
          color="green"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
          <Calendar className="!w-full !border-0" />
        </div>

        <div className="xl:col-span-2 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5">
          <div className="mb-4 flex items-center gap-2">
            <CampaignIcon className="text-violet-600" />
            <h2 className="text-lg font-bold text-slate-800">Notices</h2>
          </div>
          {!openNotice ? (
            <div className="max-h-[22rem] space-y-3 overflow-y-auto pr-1">
              {notices?.length ? (
                notices.map((notice, idx) => (
                  <div key={idx} onClick={() => setOpenNotice(notice)}>
                    <Notice idx={idx} notice={notice} notFor="" />
                  </div>
                ))
              ) : (
                <EmptyState
                  title="No notices yet"
                  hint="Create the first notice from the sidebar."
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
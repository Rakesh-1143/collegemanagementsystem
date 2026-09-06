import React, { useEffect, useState } from "react";
import HomeIcon from "@mui/icons-material/Home";
import Calendar from "react-calendar";
import CampaignIcon from "@mui/icons-material/Campaign";
import BadgeIcon from "@mui/icons-material/Badge";
import SchoolIcon from "@mui/icons-material/School";
import GroupsIcon from "@mui/icons-material/Groups";
import "react-calendar/dist/Calendar.css";
import { useDispatch, useSelector } from "react-redux";
import Notice from "../notices/Notice";
import ShowNotice from "../notices/ShowNotice";
import PageHeader from "../common/PageHeader";
import EmptyState from "../common/EmptyState";
import { getMySubjects, getMyStudents } from "../../redux/actions/facultyActions";
import { getNotice } from "../../redux/actions/adminActions";

const Body = () => {
  const dispatch = useDispatch();
  const [openNotice, setOpenNotice] = useState(null);
  
  const user = useSelector((state) => state.faculty.authData?.result);
  const notices = useSelector((state) => state.admin.notices?.result) || [];
  const mySubjects = useSelector((state) => state.faculty.mySubjects) || [];
  const myStudents = useSelector((state) => state.faculty.myStudents) || [];
  
  const name = user?.name || "Faculty";

  useEffect(() => {
    dispatch(getMySubjects());
    dispatch(getMyStudents());
    dispatch(getNotice());
  }, [dispatch]);

  const assignedSubject = mySubjects.length > 0 ? mySubjects[0] : null;

  return (
    <div className="w-full space-y-6 pb-10">
      <PageHeader
        icon={HomeIcon}
        title="Dashboard"
        subtitle={`Welcome back, ${name}`}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Profile Card */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm md:col-span-1 flex flex-col justify-center">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
              <BadgeIcon sx={{ fontSize: 32 }} />
            </div>
            <div className="min-w-0">
              <h2 className="truncate text-xl font-bold text-slate-800">
                {name}
              </h2>
              <p className="truncate text-sm text-slate-500 font-medium mt-1">
                {[user?.designation, user?.department]
                  .filter(Boolean)
                  .join(" · ") || "Faculty Member"}
              </p>
            </div>
          </div>
        </div>

        {/* My Subject Card */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm md:col-span-1 flex flex-col justify-center relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 text-blue-50 opacity-50 group-hover:scale-110 transition-transform duration-500">
            <SchoolIcon sx={{ fontSize: 120 }} />
          </div>
          <div className="relative z-10 flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
              <SchoolIcon sx={{ fontSize: 32 }} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Assigned Subject</p>
              <h2 className="truncate text-lg font-bold text-slate-800">
                {assignedSubject ? assignedSubject.subjectName : "None"}
              </h2>
              <p className="truncate text-sm text-slate-500 mt-0.5">
                {assignedSubject ? assignedSubject.subjectCode : "Pending Assignment"}
              </p>
            </div>
          </div>
        </div>

        {/* Total Students Card */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm md:col-span-1 flex flex-col justify-center relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 text-emerald-50 opacity-50 group-hover:scale-110 transition-transform duration-500">
            <GroupsIcon sx={{ fontSize: 120 }} />
          </div>
          <div className="relative z-10 flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <GroupsIcon sx={{ fontSize: 32 }} />
            </div>
            <div className="min-w-0">
               <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Total Enrolled Students</p>
              <h2 className="truncate text-2xl font-bold text-slate-800">
                {myStudents.length}
              </h2>
            </div>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        
        {/* Notices Section */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 sm:p-6 shadow-sm xl:col-span-2">
          <div className="mb-6 flex items-center gap-2">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <CampaignIcon className="text-indigo-600" />
            </div>
            <h2 className="text-lg font-bold text-slate-800">Notice Board</h2>
          </div>
          
          {!openNotice ? (
            <div className="max-h-[22rem] space-y-3 overflow-y-auto pr-1 custom-scrollbar">
              {notices?.length ? (
                notices.map((notice, idx) => (
                  <div key={idx} onClick={() => setOpenNotice(notice)} className="cursor-pointer transition-transform hover:-translate-y-0.5">
                    <Notice idx={idx} notice={notice} notFor="student" />
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
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <button
                type="button"
                onClick={() => setOpenNotice(null)}
                className="mb-4 text-sm font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors">
                ← Back to all notices
              </button>
              <ShowNotice notice={openNotice} />
            </div>
          )}
        </div>

        {/* Calendar Section */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 sm:p-6 shadow-sm flex flex-col items-center">
          <h2 className="text-lg font-bold text-slate-800 w-full mb-4 text-left">Academic Calendar</h2>
          <Calendar className="!w-full !border-0 !font-sans shadow-sm rounded-xl overflow-hidden" />
        </div>

      </div>
    </div>
  );
};

export default Body;
import React, { useEffect, useState } from "react";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../../../utils/Spinner";
import { SET_ERRORS } from "../../../redux/actionTypes";
import * as classes from "../../../utils/styles";
import PageHeader from "../../common/PageHeader";
import EmptyState from "../../common/EmptyState";

const percentageClass = (pct) => {
  if (pct >= 75) return "bg-emerald-100 text-emerald-700";
  if (pct >= 60) return "bg-amber-100 text-amber-700";
  return "bg-red-100 text-red-700";
};

const Body = () => {
  const dispatch = useDispatch();
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(true);
  const errors = useSelector((state) => state.errors);
  const attendance = useSelector((state) => state.student.attendance);

  useEffect(() => {
    if (Object.keys(errors).length !== 0) {
      setError(errors);
      setLoading(false);
    }
  }, [errors]);

  // `attendance` starts as [] and becomes { result: [...] } once fetched.
  useEffect(() => {
    if (attendance && !Array.isArray(attendance)) setLoading(false);
  }, [attendance]);

  useEffect(() => {
    dispatch({ type: SET_ERRORS, payload: {} });
  }, []);

  const rows = attendance?.result || [];
  const hasData = rows.length > 0;
  const totalAttended = rows.reduce((s, r) => s + (r.attended || 0), 0);
  const totalLectures = rows.reduce((s, r) => s + (r.total || 0), 0);
  const average =
    rows.length > 0
      ? rows.reduce((s, r) => s + parseFloat(r.percentage || 0), 0) /
        rows.length
      : 0;
  const hasError = Object.keys(error).length !== 0 && !hasData;

  return (
    <div className="flex-[0.8] mt-3">
      <div className="space-y-5">
        <PageHeader
          icon={EventAvailableIcon}
          title="My Attendance"
          subtitle="Attendance summary per subject"
        />

        {hasData && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:mr-10">
            <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Classes Attended
              </p>
              <p className="text-2xl font-bold text-slate-800">
                {totalAttended}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Total Lectures
              </p>
              <p className="text-2xl font-bold text-slate-800">
                {totalLectures}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Average Attendance
              </p>
              <span
                className={`inline-block rounded-full px-2.5 py-1 text-sm font-bold ${percentageClass(
                  average
                )}`}>
                {average.toFixed(2)}%
              </span>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl p-4 sm:p-6 lg:mr-10">
          <div className={classes.loadingAndError}>
            {loading && (
              <Spinner
                message="Loading"
                height={50}
                width={150}
                color="#111111"
                messageColor="blue"
              />
            )}
          </div>
          {!loading &&
            (hasData ? (
              <div className={classes.adminData}>
                <div className="grid grid-cols-8 min-w-[36rem]">
                  <h1 className={`${classes.adminDataHeading} col-span-1`}>
                    Sr no.
                  </h1>
                  <h1 className={`${classes.adminDataHeading} col-span-1`}>
                    Subject Code
                  </h1>
                  <h1 className={`${classes.adminDataHeading} col-span-2`}>
                    Subject Name
                  </h1>
                  <h1 className={`${classes.adminDataHeading} col-span-2`}>
                    Attended
                  </h1>
                  <h1 className={`${classes.adminDataHeading} col-span-1`}>
                    Total
                  </h1>
                  <h1 className={`${classes.adminDataHeading} col-span-1`}>
                    Percentage
                  </h1>
                </div>
                {rows.map((res, idx) => {
                  const pct = parseFloat(res.percentage || 0);
                  return (
                    <div
                      key={idx}
                      className={`${classes.adminDataBody} grid-cols-8 min-w-[36rem]`}>
                      <h1
                        className={`col-span-1 ${classes.adminDataBodyFields}`}>
                        {idx + 1}
                      </h1>
                      <h1
                        className={`col-span-1 ${classes.adminDataBodyFields}`}>
                        {res.subjectCode}
                      </h1>
                      <h1
                        className={`col-span-2 ${classes.adminDataBodyFields}`}>
                        {res.subjectName}
                      </h1>
                      <h1
                        className={`col-span-2 ${classes.adminDataBodyFields}`}>
                        {res.attended}
                      </h1>
                      <h1
                        className={`col-span-1 ${classes.adminDataBodyFields}`}>
                        {res.total}
                      </h1>
                      <h1
                        className={`col-span-1 ${classes.adminDataBodyFields}`}>
                        <span
                          className={`inline-block rounded-full px-2 py-0.5 text-xs font-bold ${percentageClass(
                            pct
                          )}`}>
                          {res.percentage}%
                        </span>
                      </h1>
                    </div>
                  );
                })}
              </div>
            ) : (
              <EmptyState
                title="No attendance records yet"
                hint={
                  hasError
                    ? "Attendance for your class has not been marked yet."
                    : "Attendance will appear here once faculty mark it for your class."
                }
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default Body;
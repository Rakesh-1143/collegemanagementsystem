import React, { useEffect, useState } from "react";
import FactCheckIcon from "@mui/icons-material/FactCheck";
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
  const testResult = useSelector((state) => state.student.testResult);

  useEffect(() => {
    if (Object.keys(errors).length !== 0) {
      setError(errors);
      setLoading(false);
    }
  }, [errors]);

  // `testResult` starts as [] and becomes { result: [...] } once fetched.
  useEffect(() => {
    if (testResult && !Array.isArray(testResult)) setLoading(false);
  }, [testResult]);

  useEffect(() => {
    dispatch({ type: SET_ERRORS, payload: {} });
  }, []);

  const rows = testResult?.result || [];
  const errorMessage = error.notestError || error.message;

  return (
    <div className="flex-[0.8] mt-3">
      <div className="space-y-5">
        <PageHeader
          icon={FactCheckIcon}
          title="Test Results"
          subtitle="Your marks across all tests"
        />
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
            (errorMessage ? (
              <EmptyState
                title="No test results yet"
                hint="Results will appear here once faculty upload marks for your class."
              />
            ) : rows.length ? (
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
                    Test
                  </h1>
                  <h1 className={`${classes.adminDataHeading} col-span-1`}>
                    Marks
                  </h1>
                  <h1 className={`${classes.adminDataHeading} col-span-1`}>
                    Score
                  </h1>
                </div>
                {rows.map((res, idx) => {
                  const pct =
                    res.totalMarks > 0
                      ? Math.round((res.marks / res.totalMarks) * 100)
                      : 0;
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
                        {res.test}
                      </h1>
                      <h1
                        className={`col-span-1 ${classes.adminDataBodyFields}`}>
                        {res.marks}/{res.totalMarks}
                      </h1>
                      <h1
                        className={`col-span-1 ${classes.adminDataBodyFields}`}>
                        <span
                          className={`inline-block rounded-full px-2 py-0.5 text-xs font-bold ${percentageClass(
                            pct
                          )}`}>
                          {pct}%
                        </span>
                      </h1>
                    </div>
                  );
                })}
              </div>
            ) : (
              <EmptyState
                title="No test results yet"
                hint="Results will appear here once faculty upload marks for your class."
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default Body;
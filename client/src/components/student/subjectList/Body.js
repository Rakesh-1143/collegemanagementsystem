import React, { useEffect, useState } from "react";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../../../utils/Spinner";
import { SET_ERRORS } from "../../../redux/actionTypes";
import * as classes from "../../../utils/styles";
import PageHeader from "../../common/PageHeader";
import EmptyState from "../../common/EmptyState";

const Body = () => {
  const dispatch = useDispatch();
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(true);
  const errors = useSelector((state) => state.errors);
  const subjects = useSelector((state) => state.admin.subjects);

  useEffect(() => {
    if (Object.keys(errors).length !== 0) {
      setError(errors);
      setLoading(false);
    }
  }, [errors]);

  // `subjects` starts as [] and becomes { result: [...] } once fetched.
  useEffect(() => {
    if (subjects && !Array.isArray(subjects)) setLoading(false);
  }, [subjects]);

  useEffect(() => {
    dispatch({ type: SET_ERRORS, payload: {} });
  }, []);

  const rows = subjects?.result || [];
  const errorMessage = error.noSubjectError || error.message;

  return (
    <div className="flex-[0.8] mt-3">
      <div className="space-y-5">
        <PageHeader
          icon={MenuBookIcon}
          title="My Subjects"
          subtitle="Subjects for your department and year"
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
            {errorMessage && !loading && (
              <p className="text-red-500 font-semibold text-center">
                {errorMessage}
              </p>
            )}
          </div>
          {!loading &&
            !errorMessage &&
            (rows.length ? (
              <div className={classes.adminData}>
                <div className="grid grid-cols-7 min-w-[32rem]">
                  <h1 className={`${classes.adminDataHeading} col-span-1`}>
                    Sr no.
                  </h1>
                  <h1 className={`${classes.adminDataHeading} col-span-2`}>
                    Subject Code
                  </h1>
                  <h1 className={`${classes.adminDataHeading} col-span-3`}>
                    Subject Name
                  </h1>
                  <h1 className={`${classes.adminDataHeading} col-span-1`}>
                    Total Lectures
                  </h1>
                </div>
                {rows.map((sub, idx) => (
                  <div
                    key={idx}
                    className={`${classes.adminDataBody} grid-cols-7 min-w-[32rem]`}>
                    <h1
                      className={`col-span-1 ${classes.adminDataBodyFields}`}>
                      {idx + 1}
                    </h1>
                    <h1
                      className={`col-span-2 ${classes.adminDataBodyFields}`}>
                      {sub.subjectCode}
                    </h1>
                    <h1
                      className={`col-span-3 ${classes.adminDataBodyFields}`}>
                      {sub.subjectName}
                    </h1>
                    <h1
                      className={`col-span-1 ${classes.adminDataBodyFields}`}>
                      {sub.totalLectures}
                    </h1>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                title="No subjects yet"
                hint="Subjects for your department and year will appear here."
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default Body;
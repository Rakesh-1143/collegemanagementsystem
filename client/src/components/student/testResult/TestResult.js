import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTestResult } from "../../../redux/actions/studentActions";
import PageLayout from "../../PageLayout";
import Sidebar from "../Sidebar";
import Body from "./Body";

const TestResult = () => {
  const user = useSelector((state) => state.student.authData);
  const dispatch = useDispatch();
  useEffect(() => {
    if (!user) return;
    dispatch(
      getTestResult(
        user.result.department,
        user.result.year,
        user.result.section
      )
    );
  }, [dispatch, user]);
  return (
    <PageLayout role="student" sidebar={<Sidebar />}>
      <Body />
    </PageLayout>
  );
};

export default TestResult;
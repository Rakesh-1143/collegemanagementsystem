import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getNotice } from "../../redux/actions/adminActions";
import {
  getAttendance,
  getSubject,
  getTestResult,
} from "../../redux/actions/studentActions";
import PageLayout from "../PageLayout";
import Body from "./Body";
import Sidebar from "./Sidebar";

const StudentHome = () => {
  const user = useSelector((state) => state.student.authData);
  const dispatch = useDispatch();
  useEffect(() => {
    if (!user) return;
    dispatch(getSubject(user.result.department, user.result.year));
    dispatch(
      getTestResult(
        user.result.department,
        user.result.year,
        user.result.section
      )
    );
    dispatch(
      getAttendance(
        user.result.department,
        user.result.year,
        user.result.section
      )
    );
    dispatch(getNotice());
  }, [dispatch, user]);

  return (
    <PageLayout role="student" sidebar={<Sidebar />}>
      <Body />
    </PageLayout>
  );
};

export default StudentHome;
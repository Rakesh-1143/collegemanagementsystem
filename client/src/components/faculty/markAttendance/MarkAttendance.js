import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getAllDepartment } from "../../../redux/actions/adminActions";
import PageLayout from "../../PageLayout";
import Body from "./Body";
import Sidebar from "../Sidebar";

const MarkAttendance = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllDepartment());
  }, [dispatch]);
  return (
    <PageLayout role="faculty" sidebar={<Sidebar />}>
      <Body />
    </PageLayout>
  );
};

export default MarkAttendance;
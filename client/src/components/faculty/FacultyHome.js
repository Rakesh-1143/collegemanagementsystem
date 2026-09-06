import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getNotice } from "../../redux/actions/adminActions";
import PageLayout from "../PageLayout";
import Body from "./Body";
import Sidebar from "./Sidebar";

const FacultyHome = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getNotice());
  }, [dispatch]);
  return (
    <PageLayout role="faculty" sidebar={<Sidebar />}>
      <Body />
    </PageLayout>
  );
};

export default FacultyHome;
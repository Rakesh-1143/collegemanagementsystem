import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getCourses } from "../../../redux/actions/adminActions";
import PageLayout from "../../PageLayout";
import Sidebar from "../Sidebar";
import Body from "./Body";

const GetCourse = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getCourses());
  }, [dispatch]);
  return (
    <PageLayout role="admin" sidebar={<Sidebar />}>
      <Body />
    </PageLayout>
  );
};

export default GetCourse;

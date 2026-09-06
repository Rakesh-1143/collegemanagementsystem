import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getMySubjects } from "../../../redux/actions/facultyActions";
import PageLayout from "../../PageLayout";
import Body from "./Body";
import Sidebar from "../Sidebar";

const MySubjects = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getMySubjects());
  }, [dispatch]);

  return (
    <PageLayout role="faculty" sidebar={<Sidebar />}>
      <Body />
    </PageLayout>
  );
};

export default MySubjects;

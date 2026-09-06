import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getMyStudents } from "../../../redux/actions/facultyActions";
import PageLayout from "../../PageLayout";
import Body from "./Body";
import Sidebar from "../Sidebar";

const MyStudents = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getMyStudents());
  }, [dispatch]);

  return (
    <PageLayout role="faculty" sidebar={<Sidebar />}>
      <Body />
    </PageLayout>
  );
};

export default MyStudents;

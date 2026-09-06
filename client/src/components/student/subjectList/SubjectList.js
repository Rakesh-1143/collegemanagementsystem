import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSubject } from "../../../redux/actions/studentActions";
import PageLayout from "../../PageLayout";
import Sidebar from "../Sidebar";
import Body from "./Body";

const SubjectList = () => {
  const user = useSelector((state) => state.student.authData);
  const dispatch = useDispatch();
  useEffect(() => {
    if (!user) return;
    dispatch(getSubject(user.result.department, user.result.year));
  }, [dispatch, user]);
  return (
    <PageLayout role="student" sidebar={<Sidebar />}>
      <Body />
    </PageLayout>
  );
};

export default SubjectList;
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  getAllStudent,
  getAllFaculty,
  getNotice,
} from "../../redux/actions/adminActions";
import PageLayout from "../PageLayout";
import Body from "./Body";
import Sidebar from "./Sidebar";

const AdminHome = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllStudent());
    dispatch(getAllFaculty());
    dispatch(getNotice());
  }, [dispatch]);
  return (
    <PageLayout role="admin" sidebar={<Sidebar />}>
      <Body />
    </PageLayout>
  );
};

export default AdminHome;
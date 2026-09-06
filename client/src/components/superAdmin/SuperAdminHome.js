import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getAdmin } from "../../redux/actions/superAdminActions";
import PageLayout from "../PageLayout";
import Body from "./Body";
import Sidebar from "./Sidebar";

const SuperAdminHome = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAdmin({ department: "" })); // Fetch all admins
  }, [dispatch]);
  return (
    <PageLayout role="superAdmin" sidebar={<Sidebar />}>
      <Body />
    </PageLayout>
  );
};

export default SuperAdminHome;

import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getSuperAdminAllDepartment, getUnassignedAdmins } from "../../../redux/actions/superAdminActions";
import Body from "./Body";
import PageLayout from "../../PageLayout";
import Sidebar from "../Sidebar";

const ManageDepartment = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getSuperAdminAllDepartment());
    dispatch(getUnassignedAdmins());
  }, [dispatch]);
  
  return (
    <PageLayout role="superAdmin" sidebar={<Sidebar />}>
      <Body />
    </PageLayout>
  );
};

export default ManageDepartment;

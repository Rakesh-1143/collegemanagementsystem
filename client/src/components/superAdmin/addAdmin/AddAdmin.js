import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getSuperAdminAllDepartment } from "../../../redux/actions/superAdminActions";
import PageLayout from "../../PageLayout";
import Sidebar from "../Sidebar";
import Body from "./Body";

const AddAdmin = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getSuperAdminAllDepartment());
  }, [dispatch]);
  return (
    <PageLayout role="superAdmin" sidebar={<Sidebar />}>
      <Body />
    </PageLayout>
  );
};

export default AddAdmin;

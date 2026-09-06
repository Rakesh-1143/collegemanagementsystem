import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getUnassignedAdmins } from "../../../redux/actions/superAdminActions";
import Body from "./Body";
import PageLayout from "../../PageLayout";
import Sidebar from "../Sidebar";

const AddDepartment = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getUnassignedAdmins());
  }, [dispatch]);
  
  return (
    <PageLayout role="superAdmin" sidebar={<Sidebar />}>
      <Body />
    </PageLayout>
  );
};

export default AddDepartment;

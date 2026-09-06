import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getBranches } from "../../../redux/actions/adminActions";
import PageLayout from "../../PageLayout";
import Sidebar from "../Sidebar";
import Body from "./Body";

const GetBranch = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getBranches());
  }, [dispatch]);
  return (
    <PageLayout role="admin" sidebar={<Sidebar />}>
      <Body />
    </PageLayout>
  );
};

export default GetBranch;

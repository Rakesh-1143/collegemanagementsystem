import React from "react";
import PageLayout from "../../PageLayout";
import Sidebar from "../Sidebar";
import Body from "./Body";

const AddBranch = () => {
  return (
    <PageLayout role="admin" sidebar={<Sidebar />}>
      <Body />
    </PageLayout>
  );
};

export default AddBranch;

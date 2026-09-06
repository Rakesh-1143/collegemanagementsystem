import React from "react";
import PageLayout from "../../PageLayout";
import Sidebar from "../Sidebar";
import Body from "./Body";

const CreateNotice = () => {
  return (
    <PageLayout role="admin" sidebar={<Sidebar />}>
      <Body />
    </PageLayout>
  );
};

export default CreateNotice;
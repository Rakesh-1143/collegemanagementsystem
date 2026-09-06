import React from "react";
import PageLayout from "../../PageLayout";
import Body from "./Body";
import Sidebar from "../Sidebar";

const CreateTest = () => {
  return (
    <PageLayout role="faculty" sidebar={<Sidebar />}>
      <Body />
    </PageLayout>
  );
};

export default CreateTest;
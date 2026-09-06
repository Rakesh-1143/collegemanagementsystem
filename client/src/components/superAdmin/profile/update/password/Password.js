import React from "react";
import PageLayout from "../../../../PageLayout";
import Sidebar from "../../../Sidebar";
import Body from "./Body";

const Password = () => {
  return (
    <PageLayout role="superAdmin" sidebar={<Sidebar />}>
      <Body />
    </PageLayout>
  );
};

export default Password;

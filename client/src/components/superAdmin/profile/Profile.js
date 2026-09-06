import React from "react";
import PageLayout from "../../PageLayout";
import Body from "./Body";
import Sidebar from "../Sidebar";

const Profile = () => {
  return (
    <PageLayout role="superAdmin" sidebar={<Sidebar />}>
      <Body />
    </PageLayout>
  );
};

export default Profile;

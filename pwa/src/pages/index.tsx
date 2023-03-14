import * as React from "react";
import { useAuthentication } from "../hooks/useAuthentication";
import { DashboardTemplate } from "../templates/dashboard/DashboardTemplate";
import { HomeTemplate } from "../templates/home/HomeTemplate";
import { LoginTemplate } from "../templates/login/LoginTemplate";

const IndexPage: React.FC = () => {
  const { isLoggedIn } = useAuthentication();

  if (isLoggedIn()) return <AuthenticatedIndex />;

  return <UnauthenticatedIndex />;
};

export default IndexPage;

const AuthenticatedIndex: React.FC = () => (
  <DashboardTemplate>
    <HomeTemplate />
  </DashboardTemplate>
);

const UnauthenticatedIndex: React.FC = () => <LoginTemplate />;

import * as React from "react";
import { isLoggedIn } from "../services/auth";
import { DashboardTemplate } from "../templates/dashboard/DashboardTemplate";
import { HomeTemplate } from "../templates/templateParts/home/HomeTemplate";
import { LandingTemplate } from "../templates/landing/LandingTemplate";

const IndexPage: React.FC = () => {
  if (isLoggedIn()) return <AuthenticatedIndex />;

  return <UnauthenticatedIndex />;
};

export default IndexPage;

const AuthenticatedIndex: React.FC = () => (
  <DashboardTemplate>
    <HomeTemplate />
  </DashboardTemplate>
);

const UnauthenticatedIndex: React.FC = () => <LandingTemplate />;

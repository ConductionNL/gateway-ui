import * as React from "react";
import { DashboardTemplate } from "../../templates/dashboard/DashboardTemplate";
import { ActionsTemplate } from "../../templates/templateParts/actions/ActionsTemplate";

const ActionsPage: React.FC = () => (
  <DashboardTemplate>
    <ActionsTemplate />
  </DashboardTemplate>
);

export default ActionsPage;

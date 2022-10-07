import * as React from "react";
import { DashboardTemplate } from "../../../templates/dashboard/DashboardTemplate";
import { ActionsDetailTemplate } from "../../../templates/templateParts/actions/ActionDetailsTemplate";

const ActionsPage: React.FC = () => (
  <DashboardTemplate>
    <ActionsDetailTemplate />
  </DashboardTemplate>
);

export default ActionsPage;

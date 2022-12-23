import * as React from "react";
import { DashboardTemplate } from "../../templates/dashboard/DashboardTemplate";
import { CronjobsTemplate } from "../../templates/cronjobsTemplate/CronjobsTemplate";

const CronjobsPage: React.FC = () => (
  <DashboardTemplate>
    <CronjobsTemplate />
  </DashboardTemplate>
);

export default CronjobsPage;

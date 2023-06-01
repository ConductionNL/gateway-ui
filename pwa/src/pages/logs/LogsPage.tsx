import * as React from "react";
import { DashboardTemplate } from "../../templates/dashboard/DashboardTemplate";
import { LogsTemplate } from "../../templates/logsTemplate/LogsTemplate";

const LogsPage: React.FC = () => (
  <DashboardTemplate>
    <LogsTemplate />
  </DashboardTemplate>
);

export default LogsPage;

import { PageProps } from "gatsby";
import * as React from "react";
import { DashboardTemplate } from "../../../templates/dashboard/DashboardTemplate";
import { LogsDetailTemplate } from "../../../templates/logs/logsDetailTemplate/LogsDetailTemplate";

const LogsDetailPage: React.FC<PageProps> = (props: PageProps) => (
  <DashboardTemplate>
    <LogsDetailTemplate logId={props.params.logId} />
  </DashboardTemplate>
);

export default LogsDetailPage;

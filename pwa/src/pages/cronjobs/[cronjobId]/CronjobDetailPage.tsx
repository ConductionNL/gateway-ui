import * as React from "react";
import { PageProps } from "gatsby";
import { DashboardTemplate } from "../../../templates/dashboard/DashboardTemplate";
import { CronjobsDetailTemplate } from "../../../templates/templateParts/cronjobs/CronjobDetailsTemplate";

const CronjobDetailPage: React.FC<PageProps> = (props: PageProps) => (
  <DashboardTemplate>
    <CronjobsDetailTemplate cronjobId={props.params.cronjobId} />
  </DashboardTemplate>
);

export default CronjobDetailPage;

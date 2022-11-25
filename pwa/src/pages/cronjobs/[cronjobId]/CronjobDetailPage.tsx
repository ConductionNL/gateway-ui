import * as React from "react";
import { PageProps } from "gatsby";
import { DashboardTemplate } from "../../../templates/dashboard/DashboardTemplate";
import { CronjobsDetailTemplate } from "../../../templates/cronjobsDetailTemplate/CronjobsDetailsTemplate";
import { CreateCronjobFormTemplate } from "../../../templates/templateParts/cronjobsForm/CreateCronjobsFormTemplate";

const CronjobDetailPage: React.FC<PageProps> = (props: PageProps) => (
  <DashboardTemplate>
    {props.params.cronjobId === "new" && <CreateCronjobFormTemplate />}
    {props.params.cronjobId !== "new" && <CronjobsDetailTemplate cronjobId={props.params.cronjobId} />}
  </DashboardTemplate>
);

export default CronjobDetailPage;

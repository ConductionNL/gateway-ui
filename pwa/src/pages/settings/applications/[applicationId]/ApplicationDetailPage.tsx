import * as React from "react";
import { PageProps } from "gatsby";
import { DashboardTemplate } from "../../../../templates/dashboard/DashboardTemplate";
import { EditApplicationTemplate } from "../../../../templates/applicationsDetailTemplate/EditApplicationsTemplate";
import { CreateApplicationTemplate } from "../../../../templates/applicationsDetailTemplate/CreateApplicationTemplate";

const ApplicationsDetailPage: React.FC<PageProps> = (props: PageProps) => (
  <DashboardTemplate>
    {props.params.applicationId === "new" && <CreateApplicationTemplate />}
    {props.params.applicationId !== "new" && <EditApplicationTemplate applicationId={props.params.applicationId} />}
  </DashboardTemplate>
);

export default ApplicationsDetailPage;

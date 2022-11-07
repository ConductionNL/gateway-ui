import * as React from "react";
import { DashboardTemplate } from "../../../../templates/dashboard/DashboardTemplate";
import { PageProps } from "gatsby";
import { CallLogDetailTemplate } from "../../../../templates/callLogDetailTemplate/CallLogDetailTemplate";

const CallLogDetailPage: React.FC<PageProps> = (props: PageProps) => (
  <DashboardTemplate>
    <CallLogDetailTemplate calllogId={props.params.calllogId} sourceId={props.params.sourceId} />
  </DashboardTemplate>
);

export default CallLogDetailPage;

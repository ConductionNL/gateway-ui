import { PageProps } from "gatsby";
import * as React from "react";
import { DashboardTemplate } from "../../../templates/dashboard/DashboardTemplate";
import { EndpointDetailTemplate } from "../../../templates/templateParts/endpoints/EndpointDetailsTemplate";

const EndpointDetailPage: React.FC<PageProps> = (props: PageProps) => (
  <DashboardTemplate>
    <EndpointDetailTemplate endpointId={props.params.endpointId} />
  </DashboardTemplate>
);

export default EndpointDetailPage;

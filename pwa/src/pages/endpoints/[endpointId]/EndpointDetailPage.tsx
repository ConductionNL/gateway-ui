import { PageProps } from "gatsby";
import * as React from "react";
import { DashboardTemplate } from "../../../templates/dashboard/DashboardTemplate";
import { EndpointDetailTemplate } from "../../../templates/endpointsDetailTemplate/EndpointDetailsTemplate";
import { CreateEndpointFormTemplate } from "../../../templates/templateParts/endpointsForm/CreateEndpointsFormTemplate";

const EndpointDetailPage: React.FC<PageProps> = (props: PageProps) => (
  <DashboardTemplate>
    {props.params.endpointId === "new" && <CreateEndpointFormTemplate />}
    {props.params.endpointId !== "new" && <EndpointDetailTemplate endpointId={props.params.endpointId} />}
  </DashboardTemplate>
);

export default EndpointDetailPage;

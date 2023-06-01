import { PageProps } from "gatsby";
import * as React from "react";
import { DashboardTemplate } from "../../../templates/dashboard/DashboardTemplate";
import { EndpointDetailTemplate } from "../../../templates/EndpointsDetailTemplate/EndpointDetailsTemplate";
import { CreateEndpointTemplate } from "../../../templates/templateParts/endpointsForm/CreateEndpointTemplate";

const EndpointDetailPage: React.FC<PageProps> = (props: PageProps) => {
  const endpointId = props.params.endpointId === "new" ? null : props.params.endpointId;

  return (
    <DashboardTemplate>
      {!endpointId && <CreateEndpointTemplate />}
      {endpointId && <EndpointDetailTemplate {...{ endpointId }} />}
    </DashboardTemplate>
  );
};

export default EndpointDetailPage;

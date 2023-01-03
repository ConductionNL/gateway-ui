import * as React from "react";
import { DashboardTemplate } from "../../templates/dashboard/DashboardTemplate";
import { EndpointsTemplate } from "../../templates/endpointsTemplate/EndpointsTemplate";

const EndpointsPage: React.FC = () => (
  <DashboardTemplate>
    <EndpointsTemplate />
  </DashboardTemplate>
);

export default EndpointsPage;

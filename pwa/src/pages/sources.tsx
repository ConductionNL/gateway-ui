import * as React from "react";
import { DashboardTemplate } from "../templates/dashboard/DashboardTemplate";
import { SourcesTemplate } from "../templates/templateParts/sources/SourcesTemplate";

const SourcesPage: React.FC = () => (
  <DashboardTemplate>
    <SourcesTemplate />
  </DashboardTemplate>
);

export default SourcesPage;

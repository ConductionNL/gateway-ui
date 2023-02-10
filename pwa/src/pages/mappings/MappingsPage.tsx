import * as React from "react";
import { DashboardTemplate } from "../../templates/dashboard/DashboardTemplate";
import { MappingTemplate } from "../../templates/mappingTemplate/MappingsTemplate";

const MappingsPage: React.FC = () => (
  <DashboardTemplate>
    <MappingTemplate />
  </DashboardTemplate>
);

export default MappingsPage;

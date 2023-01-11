import * as React from "react";
import { DashboardTemplate } from "../../templates/dashboard/DashboardTemplate";
import { SchemasTemplate } from "../../templates/schemasTemplate/SchemasTemplate";

const SchemasPage: React.FC = () => (
  <DashboardTemplate>
    <SchemasTemplate />
  </DashboardTemplate>
);

export default SchemasPage;

import * as React from "react";
import { DashboardTemplate } from "../../templates/dashboard/DashboardTemplate";
import { SchemesTemplate } from "../../templates/schemes/schemesTemplate/SchemesTemplate";

const SchemesPage: React.FC = () => (
  <DashboardTemplate>
    <SchemesTemplate />
  </DashboardTemplate>
);

export default SchemesPage;

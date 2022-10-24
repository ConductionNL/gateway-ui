import * as React from "react";
import { DashboardTemplate } from "../../templates/dashboard/DashboardTemplate";
import { SchemesTemplate } from "../../templates/schemesTemplate/SchemesTemplate";

const SchemesPage: React.FC = () => (
  <DashboardTemplate>
    <SchemesTemplate />
  </DashboardTemplate>
);

export default SchemesPage;

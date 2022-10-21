import * as React from "react";
import { DashboardTemplate } from "../../templates/dashboard/DashboardTemplate";
import { PluginsTemplate } from "../../templates/templateParts/plugins/PluginsTemplate";

const PluginsPage: React.FC = () => (
  <DashboardTemplate>
    <PluginsTemplate />
  </DashboardTemplate>
);

export default PluginsPage;

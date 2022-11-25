import * as React from "react";
import { DashboardTemplate } from "../../../templates/dashboard/DashboardTemplate";
import { PluginsTemplate } from "../../../templates/pluginsTemplate/PluginsTemplate";

const InstalledPluginsPage: React.FC = () => (
  <DashboardTemplate>
    <PluginsTemplate title="Installed" />
  </DashboardTemplate>
);

export default InstalledPluginsPage;

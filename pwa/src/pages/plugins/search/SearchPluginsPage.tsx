import * as React from "react";
import { DashboardTemplate } from "../../../templates/dashboard/DashboardTemplate";
import { PluginsTemplate } from "../../../templates/pluginsTemplate/PluginsTemplate";

const SearchPluginsPage: React.FC = () => (
  <DashboardTemplate>
    <PluginsTemplate title="Search" />
  </DashboardTemplate>
);

export default SearchPluginsPage;

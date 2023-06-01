import * as React from "react";
import { PageProps } from "gatsby";
import { DashboardTemplate } from "../../../templates/dashboard/DashboardTemplate";
import { PluginsDetailTemplate } from "../../../templates/pluginsDetailTemplate/PluginsDetailTemplate";

const PluginDetailPage: React.FC<PageProps> = (props: PageProps) => (
  <DashboardTemplate>
    <PluginsDetailTemplate pluginName={props.params.pluginId} />
  </DashboardTemplate>
);

export default PluginDetailPage;

import * as React from "react";
import { PageProps } from "gatsby";
import { DashboardTemplate } from "../../../../templates/dashboard/DashboardTemplate";
import { CreatePluginFormTemplate } from "../../../../templates/templateParts/pluginsForm/CreatePluginFormTemplate";
import { PluginsDetailTemplate } from "../../../../templates/pluginsDetailTemplate/PluginsDetailTemplate";

const SearchPluginDetailPage: React.FC<PageProps> = (props: PageProps) => (
  <DashboardTemplate>
    {props.params.pluginId === "new" && <CreatePluginFormTemplate />}
    {props.params.pluginId !== "new" && <PluginsDetailTemplate pluginId={props.params.pluginId} />}
  </DashboardTemplate>
);

export default SearchPluginDetailPage;

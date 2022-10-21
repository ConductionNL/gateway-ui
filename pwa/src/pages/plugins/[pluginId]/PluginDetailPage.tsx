import * as React from "react";
import { PageProps } from "gatsby";
import { DashboardTemplate } from "../../../templates/dashboard/DashboardTemplate";

const PluginDetailPage: React.FC<PageProps> = (props: PageProps) => (
  <DashboardTemplate>
    {props.params.pluginId === "new" && <CreatePluginFormTemplate />}
    {props.params.pluginId !== "new" && <PluginDetailTemplate pluginId={props.params.pluginId} />}
  </DashboardTemplate>
);

export default PluginDetailPage;

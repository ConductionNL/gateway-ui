import * as React from "react";
import { PageProps } from "gatsby";
import { DashboardTemplate } from "../../../templates/dashboard/DashboardTemplate";
import { DataLayerDetailTemplate } from "../../../templates/dataLayerDetailTemplate/DataLayerDetailTemplate";
import { CreateDataLayerFormTemplate } from "../../../templates/templateParts/dataLayersFormTemplate/CreateDataLayerFormTemplate";

const DataLayersDetailPage: React.FC<PageProps> = (props: PageProps) => (
  <DashboardTemplate>
    {props.params.dataLayerId === "new" && <CreateDataLayerFormTemplate />}
    {props.params.dataLayerId !== "new" && <DataLayerDetailTemplate objectId={props.params.dataLayerId} />}
  </DashboardTemplate>
);

export default DataLayersDetailPage;

import * as React from "react";
import { DashboardTemplate } from "../../templates/dashboard/DashboardTemplate";
import { DataLayerTemplate } from "../../templates/dataLayerTemplate/DataLayerTemplate";

const ObjectsPage: React.FC = () => (
  <DashboardTemplate>
    <DataLayerTemplate />
  </DashboardTemplate>
);

export default ObjectsPage;

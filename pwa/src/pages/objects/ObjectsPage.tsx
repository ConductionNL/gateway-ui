import * as React from "react";
import { DashboardTemplate } from "../../templates/dashboard/DashboardTemplate";
import { ObjectsTemplate } from "../../templates/objectsTemplate/ObjectsTemplate";

const ObjectsPage: React.FC = () => (
  <DashboardTemplate>
    <ObjectsTemplate />
  </DashboardTemplate>
);

export default ObjectsPage;

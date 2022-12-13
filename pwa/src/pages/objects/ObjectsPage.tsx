import * as React from "react";
import { DashboardTemplate } from "../../templates/dashboard/DashboardTemplate";
import { ObjectTemplate } from "../../templates/objectTemplate/ObjectTemplate";

const ObjectsPage: React.FC = () => (
  <DashboardTemplate>
    <ObjectTemplate />
  </DashboardTemplate>
);

export default ObjectsPage;

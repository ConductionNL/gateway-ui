import * as React from "react";
import { CollectionsTemplate } from "../../templates/collectionTemplate/CollectionsTemplate";
import { DashboardTemplate } from "../../templates/dashboard/DashboardTemplate";

const CollectionsPage: React.FC = () => (
  <DashboardTemplate>
    <CollectionsTemplate />
  </DashboardTemplate>
);

export default CollectionsPage;

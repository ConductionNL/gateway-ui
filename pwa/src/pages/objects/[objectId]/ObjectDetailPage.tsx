import { PageProps } from "gatsby";
import * as React from "react";
import { DashboardTemplate } from "../../../templates/dashboard/DashboardTemplate";
import { ObjectDetailTemplate } from "../../../templates/ojbectDetailTemplate/ObjectDetailTemplate";

const ObjectDetailPage: React.FC<PageProps> = (props: PageProps) => (
  <DashboardTemplate>
    <ObjectDetailTemplate objectId={props.params.objectId} />
  </DashboardTemplate>
);

export default ObjectDetailPage;

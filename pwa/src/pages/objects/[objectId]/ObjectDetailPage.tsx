import { PageProps } from "gatsby";
import * as React from "react";
import { DashboardTemplate } from "../../../templates/dashboard/DashboardTemplate";
import { ObjectDetailTemplate } from "../../../templates/objectsDetailTemplate/ObjectsDetailTemplate";
import { CreateObjectFormTemplate } from "../../../templates/templateParts/objectsFormTemplate/CreateObjectsFormTemplate";

const ObjectDetailPage: React.FC<PageProps> = (props: PageProps) => (
  <DashboardTemplate>
    {props.params.objectId === "new" && <CreateObjectFormTemplate />}
    {props.params.objectId !== "new" && <ObjectDetailTemplate objectId={props.params.objectId} />}
  </DashboardTemplate>
);

export default ObjectDetailPage;

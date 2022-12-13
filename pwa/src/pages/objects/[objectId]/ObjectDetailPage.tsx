import * as React from "react";
import { PageProps } from "gatsby";
import { DashboardTemplate } from "../../../templates/dashboard/DashboardTemplate";
import { ObjectDetailTemplate } from "../../../templates/objectDetailTemplate/ObjectDetailTemplate";
import { CreateObjectFormTemplate } from "../../../templates/templateParts/objectsFormTemplate/CreateObjectFormTemplate";

const ObjectDetailPage: React.FC<PageProps> = (props: PageProps) => {
  const params = new Proxy(new URLSearchParams(props.location.search), {
    get: (searchParams, prop) => searchParams.get(prop as string),
  }) as any;

  return (
    <DashboardTemplate>
      {props.params.objectId === "new" && <CreateObjectFormTemplate predefinedSchema={params.schema} />}
      {props.params.objectId !== "new" && <ObjectDetailTemplate objectId={props.params.objectId} />}
    </DashboardTemplate>
  );
};

export default ObjectDetailPage;

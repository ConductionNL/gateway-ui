import * as React from "react";
import { DashboardTemplate } from "../../../templates/dashboard/DashboardTemplate";
import { SourcesDetailTemplate } from "../../../templates/sourcesDetailTemplate/SourcesDetailTemplate";
import { PageProps } from "gatsby";
import { CreateSourceFormTemplate } from "../../../templates/templateParts/sourcesForm/CreateSourceFormTemplate";

const SourcesPage: React.FC<PageProps> = (props: PageProps) => (
  <DashboardTemplate>
    {props.params.sourceId === "new" && <CreateSourceFormTemplate />}
    {props.params.sourceId !== "new" && <SourcesDetailTemplate sourceId={props.params.sourceId} />}
  </DashboardTemplate>
);

export default SourcesPage;

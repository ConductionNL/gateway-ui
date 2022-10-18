import * as React from "react";
import { DashboardTemplate } from "../../../templates/dashboard/DashboardTemplate";
import { SourcesDetailTemplate } from "../../../templates/sourcesDetailTemplate/SourcesDetailTemplate";
import { PageProps } from "gatsby";

const SourcesPage: React.FC<PageProps> = (props: PageProps) => (
  <DashboardTemplate>
    <SourcesDetailTemplate sourceId={props.params.sourceId} />
  </DashboardTemplate>
);

export default SourcesPage;

import * as React from "react";
import { DashboardTemplate } from "../../../templates/dashboard/DashboardTemplate";
import { SourcesDetailTemplate } from "../../../templates/sourcesDetailTemplate/SourcesDetailTemplate";
import { PageProps } from "gatsby";
import { CreateSourceFormTemplate } from "../../../templates/templateParts/sourcesForm/CreateSourceTemplate";

const SourcesPage: React.FC<PageProps> = (props: PageProps) => {
  const sourceId = props.params.sourceId === "new" ? null : props.params.sourceId;

  return (
    <DashboardTemplate>
      {!sourceId && <CreateSourceFormTemplate />}
      {sourceId && <SourcesDetailTemplate {...{ sourceId }} />}
    </DashboardTemplate>
  );
};

export default SourcesPage;

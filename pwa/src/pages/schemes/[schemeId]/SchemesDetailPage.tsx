import * as React from "react";
import { PageProps } from "gatsby";
import { DashboardTemplate } from "../../../templates/dashboard/DashboardTemplate";
import { SchemesDetailTemplate } from "../../../templates/schemesDetailTemplate/SchemesDetailTemplate";
import { CreateSchemesFormTemplate } from "../../../templates/templateParts/schemesForm/CreateSchemesFormTemplate";

const SchemesDetailPage: React.FC<PageProps> = (props: PageProps) => (
  <DashboardTemplate>
    {props.params.schemeId === "new" && <CreateSchemesFormTemplate />}
    {props.params.schemeId !== "new" && <SchemesDetailTemplate schemeId={props.params.schemeId} />}
  </DashboardTemplate>
);

export default SchemesDetailPage;

import * as React from "react";
import { PageProps } from "gatsby";
import { DashboardTemplate } from "../../../templates/dashboard/DashboardTemplate";
import { SchemasDetailTemplate } from "../../../templates/schemasDetailTemplate/SchemasDetailTemplate";
import { CreateSchemasFormTemplate } from "../../../templates/templateParts/schemasForm/CreateSchemasFormTemplate";

const SchemasDetailPage: React.FC<PageProps> = (props: PageProps) => (
  <DashboardTemplate>
    {props.params.schemaId === "new" && <CreateSchemasFormTemplate />}
    {props.params.schemaId !== "new" && <SchemasDetailTemplate schemaId={props.params.schemaId} />}
  </DashboardTemplate>
);

export default SchemasDetailPage;

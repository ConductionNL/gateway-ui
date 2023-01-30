import * as React from "react";

import { PageProps } from "gatsby";
import { DashboardTemplate } from "../../../templates/dashboard/DashboardTemplate";
import { SchemasDetailTemplate } from "../../../templates/schemasDetailTemplate/SchemasDetailTemplate";
import { CreateSchemaTemplate } from "../../../templates/templateParts/schemasForm/CreateSchemaTemplate";

const SchemasDetailPage: React.FC<PageProps> = (props: PageProps) => {
  const schemaId = props.params.schemaId === "new" ? null : props.params.schemaId;

  return (
    <DashboardTemplate>
      {!schemaId && <CreateSchemaTemplate />}
      {schemaId && <SchemasDetailTemplate {...{ schemaId }} />}
    </DashboardTemplate>
  );
};

export default SchemasDetailPage;

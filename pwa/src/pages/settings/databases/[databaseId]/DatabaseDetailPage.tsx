import * as React from "react";
import { PageProps } from "gatsby";
import { DashboardTemplate } from "../../../../templates/dashboard/DashboardTemplate";
import { CreateDatabaseTemplate } from "../../../../templates/templateParts/databaseForm/CreateDatabaseTemplate";
import { EditDatabaseTemplate } from "../../../../templates/templateParts/databaseForm/EditDatabaseTemplate";

const DatabaseDetailPage: React.FC<PageProps> = (props: PageProps) => {
  const databaseId = props.params.databaseId === "new" ? null : props.params.databaseId;

  return (
    <DashboardTemplate>
      {!databaseId && <CreateDatabaseTemplate />}
      {databaseId && <EditDatabaseTemplate {...{ databaseId }} />}
    </DashboardTemplate>
  );
};

export default DatabaseDetailPage;

import * as React from "react";
import { PageProps } from "gatsby";
import { DashboardTemplate } from "../../../../templates/dashboard/DashboardTemplate";
import { SyncDetailTemplate } from "../../../../templates/syncDetailTemplate/SyncDetailTemplate";
import { CreateSyncFormTemplate } from "../../../../templates/templateParts/syncForm/CreateSyncFormTemplate";

const SyncDetailPage: React.FC<PageProps> = (props: PageProps) => (
  <DashboardTemplate>
    {props.params.syncId === "new" && <CreateSyncFormTemplate objectId={props.params.objectId} />}
    {props.params.syncId !== "new" && (
      <SyncDetailTemplate syncId={props.params.syncId} objectId={props.params.objectId} />
    )}
  </DashboardTemplate>
);

export default SyncDetailPage;

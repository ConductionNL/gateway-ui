import * as React from "react";
import { PageProps } from "gatsby";
import { DashboardTemplate } from "../../../../templates/dashboard/DashboardTemplate";
import { SyncDetailTemplate } from "../../../../templates/syncDetailTemplate/SyncDetailTemplate";
import { CreateSyncTemplate } from "../../../../templates/templateParts/syncForm/CreateSyncTemplate";

const SyncDetailPage: React.FC<PageProps> = (props: PageProps) => {
  const syncId = props.params.syncId === "new" ? null : props.params.syncId;

  return (
    <DashboardTemplate>
      {!syncId && <CreateSyncTemplate objectId={props.params.objectId} />}
      {syncId && <SyncDetailTemplate objectId={props.params.objectId} {...{ syncId }} />}
    </DashboardTemplate>
  );
};

export default SyncDetailPage;

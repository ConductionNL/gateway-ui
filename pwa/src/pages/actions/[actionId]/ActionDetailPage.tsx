import * as React from "react";
import { PageProps } from "gatsby";
import { DashboardTemplate } from "../../../templates/dashboard/DashboardTemplate";
import { ActionsDetailTemplate } from "../../../templates/actionsDetailTemplate/ActionsDetailsTemplate";
import { CreateActionTemplate } from "../../../templates/templateParts/actionsForm/CreateActionTemplate";

const ActionsPage: React.FC<PageProps> = (props: PageProps) => {
  const actionId = props.params.actionId === "new" ? null : props.params.actionId;

  return (
    <DashboardTemplate>
      {!actionId && <CreateActionTemplate />}
      {actionId && <ActionsDetailTemplate actionId={props.params.actionId} />}
    </DashboardTemplate>
  );
};

export default ActionsPage;

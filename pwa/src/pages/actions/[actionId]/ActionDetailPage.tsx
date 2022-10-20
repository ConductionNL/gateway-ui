import * as React from "react";
import { PageProps } from "gatsby";
import { DashboardTemplate } from "../../../templates/dashboard/DashboardTemplate";
import { ActionsDetailTemplate } from "../../../templates/templateParts/actions/ActionDetailsTemplate";
import { CreateActionFormTemplate } from "../../../templates/templateParts/actionsForm/CreateActionFormTemplate";

const ActionsPage: React.FC<PageProps> = (props: PageProps) => (
  <DashboardTemplate>
    {props.params.actionId === "new" && <CreateActionFormTemplate />}
    {props.params.actionId !== "new" && <ActionsDetailTemplate actionId={props.params.actionId} />}
  </DashboardTemplate>
);

export default ActionsPage;

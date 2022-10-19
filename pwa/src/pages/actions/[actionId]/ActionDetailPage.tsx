import * as React from "react";
import { PageProps } from "gatsby";
import { DashboardTemplate } from "../../../templates/dashboard/DashboardTemplate";
import { ActionsDetailTemplate } from "../../../templates/templateParts/actions/ActionDetailsTemplate";

const ActionsPage: React.FC<PageProps> = (props: PageProps) => (
  <DashboardTemplate>
    <ActionsDetailTemplate actionId={props.params.actionId} />
  </DashboardTemplate>
);

export default ActionsPage;

import * as React from "react";
import { PageProps } from "gatsby";
import { DashboardTemplate } from "../../../../templates/dashboard/DashboardTemplate";
import { EditAuthenticationTemplate } from "../../../../templates/templateParts/authenticationForm/EditAuthenticationTemplate";
import { CreateAuthenticationTemplate } from "../../../../templates/templateParts/authenticationForm/CreateAuthenticationTemplate";

const AuthenticationDetailPage: React.FC<PageProps> = (props: PageProps) => (
  <DashboardTemplate>
    {props.params.authenticationId === "new" && <CreateAuthenticationTemplate />}
    {props.params.authenticationId !== "new" && (
      <EditAuthenticationTemplate authenticationId={props.params.authenticationId} />
    )}
  </DashboardTemplate>
);

export default AuthenticationDetailPage;

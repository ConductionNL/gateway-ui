import * as React from "react";
import { PageProps } from "gatsby";
import { DashboardTemplate } from "../../../../templates/dashboard/DashboardTemplate";
import { EditAuthenticationFormTemplate } from "../../../../templates/templateParts/authenticationForm/EditAuthenticationFormTemplate";
import { CreateAuthenticationFormTemplate } from "../../../../templates/templateParts/authenticationForm/CreateAuthenticationFormTemplate";

const AuthenticationDetailPage: React.FC<PageProps> = (props: PageProps) => (
  <DashboardTemplate>
    {props.params.authenticationId === "new" && <CreateAuthenticationFormTemplate />}
    {props.params.authenticationId !== "new" && (
      <EditAuthenticationFormTemplate authenticationId={props.params.authenticationId} />
    )}
  </DashboardTemplate>
);

export default AuthenticationDetailPage;

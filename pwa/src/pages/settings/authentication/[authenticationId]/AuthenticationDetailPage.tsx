import * as React from "react";
import { PageProps } from "gatsby";
import { DashboardTemplate } from "../../../../templates/dashboard/DashboardTemplate";
import { EditAuthenticationTemplate } from "../../../../templates/templateParts/authenticationForm/EditAuthenticationTemplate";
import { CreateAuthenticationTemplate } from "../../../../templates/templateParts/authenticationForm/CreateAuthenticationTemplate";

const AuthenticationDetailPage: React.FC<PageProps> = (props: PageProps) => {
  const authenticationId = props.params.authenticationId === "new" ? null : props.params.authenticationId;

  return (
    <DashboardTemplate>
      {!authenticationId && <CreateAuthenticationTemplate />}
      {authenticationId && <EditAuthenticationTemplate {...{ authenticationId }} />}
    </DashboardTemplate>
  );
};

export default AuthenticationDetailPage;

import * as React from "react";
import { PageProps } from "gatsby";
import { DashboardTemplate } from "../../../../templates/dashboard/DashboardTemplate";
import { UserDetailsTemplate } from "../../../../templates/userDetailTemplate/UserDetailTemplate";
import { CreateUserFormTemplate } from "../../../../templates/templateParts/userForm/CreateUserFormTemplate";

const UserDetailPage: React.FC<PageProps> = (props: PageProps) => (
  <DashboardTemplate>
    {props.params.userId === "new" && <CreateUserFormTemplate />}
    {props.params.userId !== "new" && (
      <UserDetailsTemplate userId={props.params.userId} />
    )}
  </DashboardTemplate>
);

export default UserDetailPage;

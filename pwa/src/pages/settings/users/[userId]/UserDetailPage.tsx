import * as React from "react";
import { PageProps } from "gatsby";
import { DashboardTemplate } from "../../../../templates/dashboard/DashboardTemplate";
import { CreateUserFormTemplate } from "../../../../templates/templateParts/userForm/CreateUserFormTemplate";
import { EditUserFormTemplate } from "../../../../templates/templateParts/userForm/EditUserFormTemplate";

const UserDetailPage: React.FC<PageProps> = (props: PageProps) => (
  <DashboardTemplate>
    {props.params.userId === "new" && <CreateUserFormTemplate />}
    {props.params.userId !== "new" && (
      <EditUserFormTemplate userId={props.params.userId} />
    )}
  </DashboardTemplate>
);

export default UserDetailPage;

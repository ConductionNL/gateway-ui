import * as React from "react";
import { PageProps } from "gatsby";
import { DashboardTemplate } from "../../../../templates/dashboard/DashboardTemplate";
import { CreateUserTemplate } from "../../../../templates/templateParts/userForm/CreateUserTemplate";
import { EditUserTemplate } from "../../../../templates/templateParts/userForm/EditUserTemplate";

const UserDetailPage: React.FC<PageProps> = (props: PageProps) => {
  const userId = props.params.userId === "new" ? null : props.params.userId;

  return (
    <DashboardTemplate>
      {!userId && <CreateUserTemplate />}
      {userId && <EditUserTemplate {...{ userId }} />}
    </DashboardTemplate>
  );
};

export default UserDetailPage;

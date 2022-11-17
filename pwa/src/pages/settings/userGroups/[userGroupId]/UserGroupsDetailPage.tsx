import * as React from "react";
import { PageProps } from "gatsby";
import { DashboardTemplate } from "../../../../templates/dashboard/DashboardTemplate";
import { UserGroupsDetailTemplate } from "../../../../templates/userGroupsDetailTemplate/UserGroupsDetailsTemplate";
import { CreateUserGroupFormTemplate } from "../../../../templates/templateParts/userGroupsForm/CreateUserGroupFormTemplate";

const UserGroupsDetailPage: React.FC<PageProps> = (props: PageProps) => (
  <DashboardTemplate>
    {props.params.userGroupId === "new" && <CreateUserGroupFormTemplate />}
    {props.params.userGroupId !== "new" && <UserGroupsDetailTemplate userGroupId={props.params.userGroupId} />}
  </DashboardTemplate>
);

export default UserGroupsDetailPage;

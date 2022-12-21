import * as React from "react";
import { PageProps } from "gatsby";
import { DashboardTemplate } from "../../../../templates/dashboard/DashboardTemplate";
import { UserGroupsDetailTemplate } from "../../../../templates/userGroupsDetailTemplate/UserGroupsDetailsTemplate";
import { CreateUserGroupFormTemplate } from "../../../../templates/templateParts/userGroupsForm/CreateUserGroupFormTemplate";

const UserGroupsDetailPage: React.FC<PageProps> = (props: PageProps) => (
  <DashboardTemplate>
    {props.params.usergroupId === "new" && <CreateUserGroupFormTemplate />}
    {props.params.usergroupId !== "new" && <UserGroupsDetailTemplate userGroupId={props.params.usergroupId} />}
  </DashboardTemplate>
);

export default UserGroupsDetailPage;

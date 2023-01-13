import * as React from "react";
import { PageProps } from "gatsby";
import { DashboardTemplate } from "../../../../templates/dashboard/DashboardTemplate";

const UserDetailPage: React.FC<PageProps> = (props: PageProps) => (
  <DashboardTemplate>
    {props.params.userId === "new" && <CreateUserFormTemplate />}
    {props.params.userId !== "new" && (
      <UserDetailsTemplate organizationId={props.params.userId} />
    )}
  </DashboardTemplate>
);

export default UserDetailPage;

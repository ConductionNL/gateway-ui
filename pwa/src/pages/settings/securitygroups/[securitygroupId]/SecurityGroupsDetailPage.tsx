import * as React from "react";
import { PageProps } from "gatsby";
import { DashboardTemplate } from "../../../../templates/dashboard/DashboardTemplate";
import { CreateSecurityGroupFormTemplate } from "../../../../templates/templateParts/securityGroupsForm/CreateSecurityGroupFormTemplate";
import { SecurityGroupsDetailsTemplate } from "../../../../templates/securityGroupsDetailTemplate/SecurityGroupsDetailsTemplate";

const SecurityGroupsDetailPage: React.FC<PageProps> = (props: PageProps) => (
  <DashboardTemplate>
    {props.params.securitygroupId === "new" && <CreateSecurityGroupFormTemplate />}
    {props.params.securitygroupId !== "new" && (
      <SecurityGroupsDetailsTemplate securityGroupId={props.params.securitygroupId} />
    )}
  </DashboardTemplate>
);

export default SecurityGroupsDetailPage;

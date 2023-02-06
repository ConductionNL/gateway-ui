import * as React from "react";
import { PageProps } from "gatsby";
import { DashboardTemplate } from "../../../../templates/dashboard/DashboardTemplate";
import { CreateSecurityGroupTemplate } from "../../../../templates/templateParts/securityGroupsForm/CreateSecurityGroupFormTemplate";
import { SecurityGroupsDetailsTemplate } from "../../../../templates/securityGroupsDetailTemplate/SecurityGroupsDetailsTemplate";

const SecurityGroupsDetailPage: React.FC<PageProps> = (props: PageProps) => {
  const securityGroupId = props.params.securitygroupId === "new" ? null : props.params.securitygroupId;

  return (
    <DashboardTemplate>
      {!securityGroupId && <CreateSecurityGroupTemplate />}
      {securityGroupId && <SecurityGroupsDetailsTemplate {...{ securityGroupId }} />}
    </DashboardTemplate>
  );
};

export default SecurityGroupsDetailPage;

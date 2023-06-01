import * as React from "react";
import { PageProps } from "gatsby";
import { DashboardTemplate } from "../../../../templates/dashboard/DashboardTemplate";
import { CreateOrganizationTemplate } from "../../../../templates/templateParts/organizationsForm/CreateOrganizationTemplate";
import { EditOrganizationTemplate } from "../../../../templates/templateParts/organizationsForm/EditOrganizationTemplate";

const OrganizationsDetailPage: React.FC<PageProps> = (props: PageProps) => {
  const organizationsId = props.params.organizationsId === "new" ? null : props.params.organizationsId;

  return (
    <DashboardTemplate>
      {!organizationsId && <CreateOrganizationTemplate />}
      {organizationsId && <EditOrganizationTemplate organizationId={props.params.organizationsId} />}
    </DashboardTemplate>
  );
};

export default OrganizationsDetailPage;

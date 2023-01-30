import * as React from "react";
import { PageProps } from "gatsby";
import { DashboardTemplate } from "../../../../templates/dashboard/DashboardTemplate";
import { CreateOrganizationTemplate } from "../../../../templates/templateParts/organizationsForm/CreateOrganizationTemplate";
import { EditOrganizationTemplate } from "../../../../templates/templateParts/organizationsForm/EditOrganizationTemplate";

const OrganizationsDetailPage: React.FC<PageProps> = (props: PageProps) => (
  <DashboardTemplate>
    {props.params.organizationsId === "new" && <CreateOrganizationTemplate />}
    {props.params.organizationsId !== "new" && (
      <EditOrganizationTemplate organizationId={props.params.organizationsId} />
    )}
  </DashboardTemplate>
);

export default OrganizationsDetailPage;

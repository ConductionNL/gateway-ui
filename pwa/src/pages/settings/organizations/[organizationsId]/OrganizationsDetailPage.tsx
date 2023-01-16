import * as React from "react";
import { PageProps } from "gatsby";
import { DashboardTemplate } from "../../../../templates/dashboard/DashboardTemplate";
import { CreateOrganizationFormTemplate } from "../../../../templates/templateParts/organizationsForm/CreateOrganizationFormTemplate";
import { EditOrganizationFormTemplate } from "../../../../templates/templateParts/organizationsForm/EditOrganizationFormTemplate";

const OrganizationsDetailPage: React.FC<PageProps> = (props: PageProps) => (
  <DashboardTemplate>
    {props.params.organizationsId === "new" && <CreateOrganizationFormTemplate />}
    {props.params.organizationsId !== "new" && (
      <EditOrganizationFormTemplate organizationId={props.params.organizationsId} />
    )}
  </DashboardTemplate>
);

export default OrganizationsDetailPage;

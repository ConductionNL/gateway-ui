import * as React from "react";
import { PageProps } from "gatsby";
import { DashboardTemplate } from "../../../../templates/dashboard/DashboardTemplate";
import { OrganizationsDetailsTemplate } from "../../../../templates/organizationsDetailTemplate/OrganizationsDetailTemplate";
import { CreateOrganizationFormTemplate } from "../../../../templates/templateParts/organizationsForm/CreateOrganizationFormTemplate";

const OrganizationsDetailPage: React.FC<PageProps> = (props: PageProps) => (
  <DashboardTemplate>
    {props.params.organizationsId === "new" && <CreateOrganizationFormTemplate />}
    {props.params.organizationsId !== "new" && (
      <OrganizationsDetailsTemplate organizationId={props.params.organizationsId} />
    )}
  </DashboardTemplate>
);

export default OrganizationsDetailPage;

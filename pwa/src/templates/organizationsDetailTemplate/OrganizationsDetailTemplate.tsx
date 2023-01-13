import * as React from "react";
import * as styles from "./OrganizationsDetailsTemplate.module.css";
import { Container } from "@conduction/components";
import { EditOrganizationFormTemplate } from "../templateParts/organizationsForm/EditOrganizationFormTemplate";

interface OrganizationsDetailsTemplateProps {
  organizationId: string;
}

export const OrganizationsDetailsTemplate: React.FC<OrganizationsDetailsTemplateProps> = ({ organizationId }) => {
  return (
    <Container layoutClassName={styles.container}>
      <EditOrganizationFormTemplate {...{ organizationId }} />
    </Container>
  );
};

import * as React from "react";
import * as styles from "./OrganizationFormTemplate.module.css";
import { OrganizationForm } from "./OrganizationForm";
import { QueryClient } from "react-query";
import { useOrganization } from "../../../hooks/organization";
import Skeleton from "react-loading-skeleton";

interface CreateOrganizationFormTemplateProps {
  organizationId: string;
}

export const EditOrganizationFormTemplate: React.FC<CreateOrganizationFormTemplateProps> = ({ organizationId }) => {
  const queryClient = new QueryClient();
  const _useOrganizations = useOrganization(queryClient);
  const getOrganization = _useOrganizations.getOne(organizationId);

  return (
    <div className={styles.container}>
      {getOrganization.isSuccess && <OrganizationForm organization={getOrganization.data} />}

      {getOrganization.isLoading && <Skeleton height={200} />}
    </div>
  );
};

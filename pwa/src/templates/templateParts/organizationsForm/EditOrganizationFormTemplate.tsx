import * as React from "react";
import * as styles from "./OrganizationFormTemplate.module.css";
import { useForm } from "react-hook-form";
import { Button, Heading1 } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import { OrganizationForm } from "./OrganizationForm";
import { QueryClient } from "react-query";
import { useOrganization } from "../../../hooks/organization";
import Skeleton from "react-loading-skeleton";

interface CreateOrganizationFormTemplateProps {
  organizationId: string;
}

export const EditOrganizationFormTemplate: React.FC<CreateOrganizationFormTemplateProps> = ({ organizationId }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = React.useState<boolean>(false);

  const queryClient = new QueryClient();
  const _useOrganizations = useOrganization(queryClient);
  const getOrganization = _useOrganizations.getOne(organizationId);

  return (
    <div className={styles.container}>
      {getOrganization.isSuccess && <OrganizationForm organization={getOrganization.data} {...{ loading }} />}

      {getOrganization.isLoading && <Skeleton height={200} />}
    </div>
  );
};

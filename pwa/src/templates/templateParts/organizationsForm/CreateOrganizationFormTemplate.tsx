import * as React from "react";
import * as styles from "./OrganizationFormTemplate.module.css";
import { useTranslation } from "react-i18next";
import { OrganizationForm } from "./OrganizationForm";

export const CreateOrganizationFormTemplate: React.FC = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = React.useState<boolean>(false);

  return (
    <div className={styles.container}>
      <OrganizationForm {...{ loading }} />
    </div>
  );
};

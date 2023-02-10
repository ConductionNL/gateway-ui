import * as React from "react";
import * as styles from "./OrganizationFormTemplate.module.css";
import { OrganizationForm, formId } from "./OrganizationForm";
import { useTranslation } from "react-i18next";
import { useIsLoadingContext } from "../../../context/isLoading";
import { FormHeaderTemplate } from "../formHeader/FormHeaderTemplate";

export const CreateOrganizationTemplate: React.FC = () => {
  const { t } = useTranslation();
  const { isLoading } = useIsLoadingContext();

  return (
    <div className={styles.container}>
      <FormHeaderTemplate title={t("Create Organization")} {...{ formId }} disabled={isLoading.organizationForm} />

      <OrganizationForm />
    </div>
  );
};

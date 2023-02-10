import * as React from "react";
import * as styles from "./CreateSecurityGroupTemplate.module.css";
import { useTranslation } from "react-i18next";
import { SecurityGroupFormTemplate, formId } from "./SecurityGroupFormTemplate";
import { useIsLoading } from "../../../context/isLoading";
import { FormHeaderTemplate } from "../formHeader/FormHeaderTemplate";

export const CreateSecurityGroupTemplate: React.FC = () => {
  const { t } = useTranslation();
  const { isLoading } = useIsLoading();

  return (
    <div className={styles.container}>
      <FormHeaderTemplate title={t("Create Security Group")} {...{ formId }} disabled={isLoading.securityGroupForm} />

      <SecurityGroupFormTemplate />
    </div>
  );
};

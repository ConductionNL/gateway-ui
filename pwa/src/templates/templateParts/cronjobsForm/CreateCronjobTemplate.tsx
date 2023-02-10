import * as React from "react";
import * as styles from "./CreateCronjobTemplate.module.css";
import { useTranslation } from "react-i18next";
import { useIsLoading } from "../../../context/isLoading";
import { CronjobFormTemplate, formId } from "./CronjobsFormTemplate";
import { FormHeaderTemplate } from "../formHeader/FormHeaderTemplate";

export const CreateCronjobTemplate: React.FC = () => {
  const { t } = useTranslation();
  const { isLoading } = useIsLoading();

  return (
    <div className={styles.container}>
      <FormHeaderTemplate title={t("Create Cronjob")} {...{ formId }} disabled={isLoading.cronjobForm} />

      <CronjobFormTemplate />
    </div>
  );
};

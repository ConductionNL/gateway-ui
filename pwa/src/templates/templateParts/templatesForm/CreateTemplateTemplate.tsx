import * as React from "react";
import * as styles from "./TemplateFormTemplate.module.css";
import { useTranslation } from "react-i18next";
import { TemplateFormTemplate, formId } from "./TemplateFormTemplate";
import { FormHeaderTemplate } from "../formHeader/FormHeaderTemplate";
import { useIsLoadingContext } from "../../../context/isLoading";

export const CreateTemplateTemplate: React.FC = () => {
  const { t } = useTranslation();
  const { isLoading } = useIsLoadingContext();

  return (
    <div className={styles.container}>
      <FormHeaderTemplate title={t("Create Template")} {...{ formId }} disabled={isLoading.actionForm} />

      <TemplateFormTemplate />
    </div>
  );
};

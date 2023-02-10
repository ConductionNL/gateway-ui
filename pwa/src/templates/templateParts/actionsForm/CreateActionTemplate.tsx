import * as React from "react";
import * as styles from "./ActionFormTemplate.module.css";
import { useTranslation } from "react-i18next";
import { ActionFormTemplate, formId } from "./ActionFormTemplate";
import { FormHeaderTemplate } from "../formHeader/FormHeaderTemplate";
import { useIsLoadingContext } from "../../../context/isLoading";

export const CreateActionTemplate: React.FC = () => {
  const { t } = useTranslation();
  const { isLoading } = useIsLoadingContext();

  return (
    <div className={styles.container}>
      <FormHeaderTemplate title={t("Create Action")} {...{ formId }} disabled={isLoading.actionForm} />

      <ActionFormTemplate />
    </div>
  );
};

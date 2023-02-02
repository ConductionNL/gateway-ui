import * as React from "react";
import * as styles from "./ActionFormTemplate.module.css";
import { useTranslation } from "react-i18next";
import { ActionFormTemplate, formId } from "./ActionFormTemplate";
import { IsLoadingContext } from "../../../context/isLoading";
import { FormHeaderTemplate } from "../formHeader/FormHeaderTemplate";

export const CreateActionTemplate: React.FC = () => {
  const { t } = useTranslation();
  const [isLoading] = React.useContext(IsLoadingContext);

  return (
    <div className={styles.container}>
      <FormHeaderTemplate title={t("Create Action")} {...{ formId }} disabled={isLoading.actionForm} />

      <ActionFormTemplate />
    </div>
  );
};

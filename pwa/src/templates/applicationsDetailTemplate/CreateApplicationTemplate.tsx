import * as React from "react";
import * as styles from "./ApplicationTemplate.module.css";
import { ApplicationsFormTemplate, formId } from "../templateParts/applicationsForm/ApplicationsFormTemplate";
import { useTranslation } from "react-i18next";
import { IsLoadingContext } from "../../context/isLoading";
import { FormHeaderTemplate } from "../templateParts/formHeader/FormHeaderTemplate";

export const CreateApplicationTemplate: React.FC = () => {
  const { t } = useTranslation();
  const [isLoading] = React.useContext(IsLoadingContext);

  return (
    <div className={styles.container}>
      <FormHeaderTemplate title={t("Create Application")} {...{ formId }} disabled={isLoading.applicationForm} />

      <ApplicationsFormTemplate />
    </div>
  );
};

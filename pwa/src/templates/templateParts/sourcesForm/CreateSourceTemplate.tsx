import * as React from "react";
import * as styles from "./SourcesFormTemplate.module.css";

import { useTranslation } from "react-i18next";
import { SourceFormTemplate, formId } from "./SourceFormTemplate";
import { IsLoadingContext } from "../../../context/isLoading";
import { FormHeaderTemplate } from "../formHeader/FormHeaderTemplate";

export const CreateSourceFormTemplate: React.FC = () => {
  const { t } = useTranslation();
  const [isLoading] = React.useContext(IsLoadingContext);

  return (
    <div className={styles.container}>
      <FormHeaderTemplate title={t("Create Source")} disabled={isLoading.sourceForm} {...{ formId }} />

      <SourceFormTemplate />
    </div>
  );
};

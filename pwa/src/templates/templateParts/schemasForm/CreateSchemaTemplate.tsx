import * as React from "react";
import * as styles from "./SchemasFormTemplate.module.css";

import { useTranslation } from "react-i18next";
import { SchemaFormTemplate, formId } from "./SchemaFormTemplate";
import { IsLoadingContext } from "../../../context/isLoading";
import { FormHeaderTemplate } from "../formHeader/FormHeaderTemplate";

export const CreateSchemaTemplate: React.FC = () => {
  const { t } = useTranslation();
  const [isLoading] = React.useContext(IsLoadingContext);

  return (
    <div className={styles.container}>
      <FormHeaderTemplate title={t("Create Schema")} {...{ formId }} disabled={isLoading.schemaForm} />

      <SchemaFormTemplate />
    </div>
  );
};

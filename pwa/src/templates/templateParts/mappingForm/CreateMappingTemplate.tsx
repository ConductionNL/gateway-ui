import * as React from "react";
import * as styles from "./MappingFormTemplate.module.css";
import { useTranslation } from "react-i18next";
import { useIsLoadingContext } from "../../../context/isLoading";
import { MappingFormTemplate, formId } from "./MappingFormTemplate";
import { FormHeaderTemplate } from "../formHeader/FormHeaderTemplate";

export const CreateMappingTemplate: React.FC = () => {
  const { t } = useTranslation();
  const { isLoading } = useIsLoadingContext();

  return (
    <div className={styles.container}>
      <FormHeaderTemplate title={t("Create Mapping")} {...{ formId }} disabled={isLoading.mappingForm} />

      <MappingFormTemplate />
    </div>
  );
};

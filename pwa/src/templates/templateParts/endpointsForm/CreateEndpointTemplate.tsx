import * as React from "react";
import * as styles from "./CreateEndpointTemplate.module.css";
import { useTranslation } from "react-i18next";
import { EndpointFormTemplate, formId } from "./EndpointFormTemplate";
import { useIsLoading } from "../../../context/isLoading";
import { FormHeaderTemplate } from "../formHeader/FormHeaderTemplate";

export const CreateEndpointTemplate: React.FC = () => {
  const { t } = useTranslation();
  const { isLoading } = useIsLoading();

  return (
    <div className={styles.container}>
      <FormHeaderTemplate title={t("Create Endpoint")} disabled={isLoading.endpointForm} {...{ formId }} />

      <EndpointFormTemplate />
    </div>
  );
};

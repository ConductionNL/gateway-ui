import * as React from "react";
import * as styles from "./AuthenticationFormTemplate.module.css";

import { useTranslation } from "react-i18next";
import { useIsLoadingContext } from "../../../context/isLoading";
import { AuthenticationFormTemplate, formId } from "./AuthenticationFormTemplate";
import { FormHeaderTemplate } from "../formHeader/FormHeaderTemplate";

export const CreateAuthenticationTemplate: React.FC = () => {
  const { t } = useTranslation();
  const { isLoading } = useIsLoadingContext();

  return (
    <div className={styles.container}>
      <FormHeaderTemplate
        title={t("Create Authentication Provider")}
        {...{ formId }}
        disabled={isLoading.authenticationForm}
      />

      <AuthenticationFormTemplate />
    </div>
  );
};

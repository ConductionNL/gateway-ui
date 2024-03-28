import * as React from "react";
import * as styles from "./SourcesFormTemplate.module.css";
import { FieldValues, UseFormRegister } from "react-hook-form";
import FormField, { FormFieldInput, FormFieldLabel } from "@gemeente-denhaag/form-field";
import { useTranslation } from "react-i18next";
import { InputCheckbox, InputText, Textarea, ToolTip } from "@conduction/components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { InputFloat, InputNumber } from "@conduction/components/lib/components/formFields/input";
import ToggleButton from "../../../components/toggleButton/ToggleButton";
import { ILoggingConfigSwitch, ILoggingConfigSwitchSetters } from "../../../hooks/useLoggingConfigSwitch";

interface ReactHookFormProps {
  register: UseFormRegister<FieldValues>;
  errors: { [x: string]: any };
}

interface SourceTemplateProps {
  set2: ILoggingConfigSwitchSetters;
  loggingConfigSwitchState: ILoggingConfigSwitch;
  isLoading: any;
}

export const SourceFormLoggingConfigTemplate: React.FC<SourceTemplateProps & ReactHookFormProps> = ({
  isLoading,
  register,
  errors,
  loggingConfigSwitchState,
  set2,
}) => {
  const { t } = useTranslation();

  return (
    <div className={styles.gridContainer}>
      {console.log(set2)}
      {console.log(loggingConfigSwitchState)}
      <p className={styles.infoParagraph}>
        {t("Here you can configure what you want to log for requests that are made to this source.")}
      </p>
      <div className={styles.grid}>
        <FormField>
          <div className={styles.formFieldHeader}>
            <FormFieldLabel>{t("Call body")}</FormFieldLabel>
          </div>
          <InputCheckbox name="callBody" disabled={isLoading} label="True" {...{ register, errors }} />
        </FormField>
        <FormField>
          <div className={styles.formFieldHeader}>
            <FormFieldLabel>{t("Call content type")}</FormFieldLabel>
          </div>
          <InputCheckbox name="callContentType" disabled={isLoading} label="True" {...{ register, errors }} />
        </FormField>
        <FormField>
          <div className={styles.formFieldHeader}>
            <FormFieldLabel>{t("Call query")}</FormFieldLabel>
          </div>
          <InputCheckbox name="callQuery" disabled={isLoading} label="True" {...{ register, errors }} />
        </FormField>
        <FormField>
          <div className={styles.formFieldHeader}>
            <FormFieldLabel>{t("Call url")}</FormFieldLabel>
          </div>
          <InputCheckbox name="callUrl" disabled={isLoading} label="True" {...{ register, errors }} />
        </FormField>
        <FormField>
          <div className={styles.formFieldHeader}>
            <FormFieldLabel>{t("Max character count body")}</FormFieldLabel>
          </div>
          <InputNumber {...{ register, errors }} name="maxCharCountBody" disabled={isLoading} />
        </FormField>
        <FormField>
          <div className={styles.formFieldHeader}>
            <FormFieldLabel>{t("Max character count error body")}</FormFieldLabel>
          </div>
          <InputNumber {...{ register, errors }} name="maxCharCountErrorBody" disabled={isLoading} />
        </FormField>
        <FormField>
          <div className={styles.formFieldHeader}>
            <FormFieldLabel>{t("Response body")}</FormFieldLabel>
          </div>
          <InputCheckbox name="responseBody" disabled={isLoading} label="True" {...{ register, errors }} />
        </FormField>
        <FormField>
          <div className={styles.formFieldHeader}>
            <FormFieldLabel>{t("Response content type")}</FormFieldLabel>
          </div>
          <InputCheckbox name="responseContentType" disabled={isLoading} label="True" {...{ register, errors }} />
        </FormField>
        <FormField>
          <div className={styles.formFieldHeader}>
            <FormFieldLabel>{t("Response status code")}</FormFieldLabel>
          </div>
          <InputCheckbox name="responseStatusCode" disabled={isLoading} label="True" {...{ register, errors }} />
        </FormField>
      </div>
    </div>
  );
};

export const loggingConfigFormKeysToRemove: string[] = [
  "callBody",
  "callMethod",
  "callQuery",
  "callUrl",
  "maxCharCountBody",
  "maxCharCountErrorBody",
  "responseBody",
  "responseContentType",
  "responseStatusCode",
];

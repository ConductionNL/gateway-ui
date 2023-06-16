import * as React from "react";
import * as styles from "./TestSourceConnectionFormTemplate.module.css";
import { SelectSingle, InputText } from "@conduction/components";
import { faArrowsRotate } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@gemeente-denhaag/components-react";
import FormField, { FormFieldInput, FormFieldLabel } from "@gemeente-denhaag/form-field";
import clsx from "clsx";
import { t } from "i18next";
import { useForm } from "react-hook-form";
import { useQueryClient } from "react-query";
import { useIsLoadingContext } from "../../../context/isLoading";
import { useSource } from "../../../hooks/source";
import { enrichValidation } from "../../../services/enrichReactHookFormValidation";
import { CodeEditor } from "../../../components/codeEditor/CodeEditor";

interface TestSourceConnectionFormTemplateProps {
  sourceId: string;
}

export const TestSourceConnectionFormTemplate: React.FC<TestSourceConnectionFormTemplateProps> = ({ sourceId }) => {
  const { setIsLoading, isLoading } = useIsLoadingContext();
  const testProxy = useSource(useQueryClient()).getProxy(sourceId);
  const [testProxyInput, setTestProxyInput] = React.useState<string>("");
  const [selectedBodyLanguage, setSelectedBodyLanguage] = React.useState<any>("json");

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  const onSubmit = (data: any) => {
    const payload = {
      ...data,
      body: testProxyInput ? JSON.parse(testProxyInput) : [],
    };

    delete payload.bodyLanguage;

    testProxy.mutate({ id: sourceId, payload: payload });
  };

  React.useEffect(() => {
    setIsLoading({ sourceForm: testProxy.isLoading });
  }, [testProxy.isLoading]);

  const watchBodyLanguage = watch("bodyLanguage");

  React.useEffect(() => {
    if (!watchBodyLanguage) return;

    const selectedLanguage = bodyLanguageSelectOptions.find(
      (bodyLanguageOption) => bodyLanguageOption.value === watchBodyLanguage.value,
    );

    setSelectedBodyLanguage(selectedLanguage?.value);
  }, [watchBodyLanguage]);

  React.useEffect(() => {
    const defaultLanguage = bodyLanguageSelectOptions.find(
      (bodyLanguageOption) => bodyLanguageOption.value === selectedBodyLanguage,
    );
    setValue("bodyLanguage", defaultLanguage);
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Button
        className={clsx(styles.buttonIcon, styles.testConnectionButton)}
        disabled={isLoading.sourceForm}
        type="submit"
      >
        <FontAwesomeIcon icon={faArrowsRotate} />
        {t("Test connection")}
      </Button>

      <div className={styles.gridContainer}>
        <div className={styles.grid}>
          <FormField>
            <FormFieldInput>
              <FormFieldLabel>{t("Method")}</FormFieldLabel>
              <SelectSingle
                validation={enrichValidation({ required: true })}
                {...{ register, errors, control }}
                name="method"
                options={methodSelectOptions}
                disabled={isLoading.sourceForm}
              />
            </FormFieldInput>
          </FormField>

          <FormField>
            <FormFieldInput>
              <FormFieldLabel>{t("Endpoint")}</FormFieldLabel>
              <InputText {...{ register, errors }} name="endpoint" disabled={isLoading.sourceForm} />
            </FormFieldInput>
          </FormField>

          <FormField>
            <FormFieldInput>
              <FormFieldLabel>{t("Body Language")}</FormFieldLabel>
              <SelectSingle
                {...{ register, errors, control }}
                name="bodyLanguage"
                options={bodyLanguageSelectOptions}
                defaultValue={selectedBodyLanguage}
                disabled={isLoading.sourceForm}
              />
            </FormFieldInput>
          </FormField>
        </div>

        <FormField>
          <FormFieldInput>
            <FormFieldLabel>{t("Body")}</FormFieldLabel>

            <CodeEditor language={selectedBodyLanguage} code={testProxyInput} setCode={setTestProxyInput} />
          </FormFieldInput>
        </FormField>
      </div>
    </form>
  );
};

const methodSelectOptions = [
  { label: "POST", value: "POST" },
  { label: "PUT", value: "PUT" },
  { label: "PATCH", value: "PATCH" },
  { label: "UPDATE", value: "UPDATE" },
  { label: "GET", value: "GET" },
  { label: "DELETE", value: "DELETE" },
];

const bodyLanguageSelectOptions = [
  { label: "JSON", value: "json" },
  { label: "XML", value: "xml" },
];

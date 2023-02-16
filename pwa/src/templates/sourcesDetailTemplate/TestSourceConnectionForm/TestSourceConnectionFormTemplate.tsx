import * as React from "react";
import * as styles from "./TestSourceConnectionFormTemplate.module.css";

import { SelectSingle, InputText, Textarea } from "@conduction/components";
import { faArrowsRotate } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@gemeente-denhaag/components-react";
import FormField, { FormFieldInput, FormFieldLabel } from "@gemeente-denhaag/form-field";
import clsx from "clsx";
import { t } from "i18next";
import { useForm } from "react-hook-form";
import { useQueryClient } from "react-query";
import { ErrorMessage } from "../../../components/errorMessage/ErrorMessage";
import { useIsLoadingContext } from "../../../context/isLoading";
import { useSource } from "../../../hooks/source";
import { validateStringAsJSON } from "../../../services/validateJSON";

interface TestSourceConnectionFormTemplateProps {
  sourceId: string;
}

export const TestSourceConnectionFormTemplate: React.FC<TestSourceConnectionFormTemplateProps> = ({ sourceId }) => {
  const { setIsLoading, isLoading } = useIsLoadingContext();
  const testProxy = useSource(useQueryClient()).getProxy(sourceId);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data: any) => {
    const payload = {
      ...data,
      body: data.body ? JSON.parse(data.body) : [],
    };

    testProxy.mutate({ id: sourceId, payload: payload });
  };

  React.useEffect(() => {
    setIsLoading({ sourceForm: testProxy.isLoading });
  }, [testProxy.isLoading]);

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
                validation={{ required: true }}
                {...{ register, errors, control }}
                name="method"
                options={methodSelectOptions}
                disabled={isLoading.sourceForm}
              />

              {errors["method"] && <ErrorMessage message="This field is required." />}
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
              <FormFieldLabel>{t("Body")}</FormFieldLabel>
              <Textarea
                {...{ register, errors }}
                name="body"
                validation={{ validate: validateStringAsJSON }}
                disabled={isLoading.sourceForm}
              />
              {errors["body"] && <ErrorMessage message={errors["body"].message} />}
            </FormFieldInput>
          </FormField>
        </div>
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

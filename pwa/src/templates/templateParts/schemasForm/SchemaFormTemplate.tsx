import * as React from "react";
import * as styles from "./SchemasFormTemplate.module.css";

import { useForm } from "react-hook-form";
import { useQueryClient } from "react-query";
import { useTranslation } from "react-i18next";
import { useSchema } from "../../../hooks/schema";
import { InputText, Textarea } from "@conduction/components";
import { ErrorMessage } from "../../../components/errorMessage/ErrorMessage";
import FormField, { FormFieldInput, FormFieldLabel } from "@gemeente-denhaag/form-field";
import { IsLoadingContext } from "../../../context/isLoading";

interface SchemaFormTemplateProps {
  schema?: any;
}

export const formId: string = "schema-form";

export const SchemaFormTemplate: React.FC<SchemaFormTemplateProps> = ({ schema }) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = React.useContext(IsLoadingContext);

  const queryClient = useQueryClient();
  const _useSchema = useSchema(queryClient);
  const createOrEditSchema = _useSchema.createOrEdit(schema?.id);

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data: any): void => {
    createOrEditSchema.mutate({ payload: data, id: schema?.id });

    schema?.id && queryClient.setQueryData(["entities", schema.id], data); // optimistic update query data
  };

  React.useEffect(() => {
    if (!schema) return;

    ["name", "description", "reference"].forEach((field) => setValue(field, schema[field]));
  }, [schema]);

  React.useEffect(() => {
    setIsLoading({ ...isLoading, schemaForm: createOrEditSchema.isLoading });
  }, [createOrEditSchema.isLoading]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} id={formId}>
      <div className={styles.gridContainer}>
        <div className={styles.grid}>
          <FormField>
            <FormFieldInput>
              <FormFieldLabel>{t("Name")}</FormFieldLabel>

              <InputText
                {...{ register, errors }}
                name="name"
                validation={{ required: true, maxLength: 225 }}
                disabled={isLoading.schemaForm}
              />

              {errors["name"] && <ErrorMessage message={errors["name"].message} />}
            </FormFieldInput>
          </FormField>

          <FormField>
            <FormFieldInput>
              <FormFieldLabel>{t("Description")}</FormFieldLabel>

              <Textarea {...{ register, errors }} name="description" disabled={isLoading.schemaForm} />
            </FormFieldInput>
          </FormField>

          <FormField>
            <FormFieldInput>
              <FormFieldLabel>{t("Reference")}</FormFieldLabel>

              <InputText
                {...{ register, errors }}
                name="reference"
                validation={{ maxLength: 225 }}
                disabled={isLoading.schemaForm}
              />

              {errors["reference"] && <ErrorMessage message={errors["reference"].message} />}
            </FormFieldInput>
          </FormField>
        </div>
      </div>
    </form>
  );
};

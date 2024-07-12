import * as React from "react";
import * as styles from "./SchemasFormTemplate.module.css";

import { useForm } from "react-hook-form";
import { useQueryClient } from "react-query";
import { useTranslation } from "react-i18next";
import { useSchema } from "../../../hooks/schema";
import { InputCheckbox, InputNumber, InputText, Textarea } from "@conduction/components";
import FormField, { FormFieldInput, FormFieldLabel } from "@gemeente-denhaag/form-field";
import { useIsLoadingContext } from "../../../context/isLoading";
import { enrichValidation } from "../../../services/enrichReactHookFormValidation";

interface SchemaFormTemplateProps {
  schema?: any;
}

export const formId: string = "schema-form";

export const SchemaFormTemplate: React.FC<SchemaFormTemplateProps> = ({ schema }) => {
  const { t } = useTranslation();
  const { setIsLoading, isLoading } = useIsLoadingContext();

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

    [
      "name",
      "description",
      "reference",
      "version",
      "maxDepth",
      "extend",
      "inherited",
      "exclude",
      "persist",
      "createAuditTrails",
      "softDelete",
    ].forEach((field) => setValue(field, schema[field]));
  }, [schema]);

  React.useEffect(() => {
    setIsLoading({ schemaForm: createOrEditSchema.isLoading });
  }, [createOrEditSchema.isLoading]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} id={formId}>
      <div className={styles.gridContainer}>
        <div className={styles.grid}>
          <FormField>
            <FormFieldInput>
              <FormFieldLabel>{t("Reference")}</FormFieldLabel>

              <InputText
                {...{ register, errors }}
                name="reference"
                validation={enrichValidation({ maxLength: 225 })}
                disabled={isLoading.schemaForm}
                ariaLabel={t("Enter reference")}
              />
            </FormFieldInput>
          </FormField>

          <FormField>
            <FormFieldInput>
              <FormFieldLabel>{t("Version")}</FormFieldLabel>
              <InputText
                {...{ register, errors }}
                name="version"
                disabled={isLoading.schemaForm}
                defaultValue={schema?.version ?? "0.0.0"}
                ariaLabel={t("Enter version")}
              />
            </FormFieldInput>
          </FormField>

          <FormField>
            <FormFieldInput>
              <FormFieldLabel>{t("Name")}</FormFieldLabel>

              <InputText
                {...{ register, errors }}
                name="name"
                validation={enrichValidation({ required: true, maxLength: 225 })}
                disabled={isLoading.schemaForm}
                ariaLabel={t("Enter name")}
              />
            </FormFieldInput>
          </FormField>

          <FormField>
            <FormFieldInput>
              <FormFieldLabel>{t("Description")}</FormFieldLabel>

              <Textarea
                {...{ register, errors }}
                name="description"
                disabled={isLoading.schemaForm}
                ariaLabel={t("Enter description")}
              />
            </FormFieldInput>
          </FormField>

          <FormField>
            <FormFieldInput>
              <FormFieldLabel>{t("MaxDepth")}</FormFieldLabel>

              <InputNumber
                {...{ register, errors }}
                name="maxDepth"
                disabled={isLoading.schemaForm}
                ariaLabel={t("Enter maxDepth")}
              />
            </FormFieldInput>
          </FormField>

          <FormField>
            <FormFieldInput>
              <FormFieldLabel>{t("Extend")}</FormFieldLabel>

              <InputCheckbox disabled={isLoading.schemaForm} {...{ register, errors }} label="on" name="extend" />
            </FormFieldInput>
          </FormField>

          <FormField>
            <FormFieldInput>
              <FormFieldLabel>{t("Inherited")}</FormFieldLabel>

              <InputCheckbox disabled={isLoading.schemaForm} {...{ register, errors }} label="on" name="inherited" />
            </FormFieldInput>
          </FormField>

          <FormField>
            <FormFieldInput>
              <FormFieldLabel>{t("Exclude")}</FormFieldLabel>

              <InputCheckbox disabled={isLoading.schemaForm} {...{ register, errors }} label="on" name="exclude" />
            </FormFieldInput>
          </FormField>

          <FormField>
            <FormFieldInput>
              <FormFieldLabel>{t("Persist")}</FormFieldLabel>

              <InputCheckbox
                disabled={isLoading.schemaForm}
                defaultChecked={schema?.persist ?? true}
                {...{ register, errors }}
                label="on"
                name="persist"
              />
            </FormFieldInput>
          </FormField>

          <FormField>
            <FormFieldInput>
              <FormFieldLabel>{t("Soft delete")}</FormFieldLabel>

              <InputCheckbox disabled={isLoading.schemaForm} {...{ register, errors }} label="on" name="softDelete" />
            </FormFieldInput>
          </FormField>
        </div>
      </div>
    </form>
  );
};

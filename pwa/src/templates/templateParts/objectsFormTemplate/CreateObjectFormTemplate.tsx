import * as React from "react";
import * as styles from "./ObjectFormTemplate.module.css";
import { useForm } from "react-hook-form";
import FormField, { FormFieldInput, FormFieldLabel } from "@gemeente-denhaag/form-field";
import { Divider, Heading1 } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { InputText, SelectSingle } from "@conduction/components";
import { useQueryClient } from "react-query";
import { useObject } from "../../../hooks/object";
import { useSchema } from "../../../hooks/schema";
import Skeleton from "react-loading-skeleton";
import { SchemaFormTemplate } from "../schemaForm/SchemaFormTemplate";
import { mapSelectInputFormData } from "../../../services/mapSelectInputFormData";
import { FormSaveButton, TAfterSuccessfulFormSubmit } from "../formSaveButton/FormSaveButton";
import { navigate } from "gatsby";
import { enrichValidation } from "../../../services/enrichReactHookFormValidation";

interface CreateObjectFormTemplateProps {
  predefinedSchema?: string;
}

export const CreateObjectFormTemplate: React.FC<CreateObjectFormTemplateProps> = ({ predefinedSchema }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [selectedSchema, setSelectedSchema] = React.useState<any>(null);
  const [afterSuccessfulFormSubmit, setAfterSuccessfulFormSubmit] = React.useState<TAfterSuccessfulFormSubmit>("save");

  const queryClient = useQueryClient();
  const _useObjects = useObject();
  const createOrEditObject = _useObjects.createOrEdit();

  const _useSchema = useSchema(queryClient);
  const getSchemas = _useSchema.getAll();
  const getSchemaSchema = _useSchema.getSchema(selectedSchema);

  const {
    watch,
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  React.useEffect(() => {
    if (!predefinedSchema) return;

    setSelectedSchema(predefinedSchema);
  }, [predefinedSchema]);

  const watchSchema = watch("schema");

  React.useEffect(() => {
    if (!watchSchema) return;

    setSelectedSchema(watchSchema.value);
  }, [watchSchema]);

  React.useEffect(() => {
    if ((getSchemas.isLoading && !predefinedSchema) || getSchemaSchema.isLoading || createOrEditObject.isLoading) {
      setLoading(true);
      return;
    }

    setLoading(false);
  }, [getSchemas.isLoading, getSchemaSchema.isLoading, createOrEditObject.isLoading]);

  const onSubmit = (data: any): void => {
    if (!selectedSchema) return;

    delete data.schema;
    createOrEditObject.mutate(
      { payload: mapSelectInputFormData(data), entityId: selectedSchema },
      {
        onSuccess: (newObject) => {
          switch (afterSuccessfulFormSubmit) {
            case "save":
              navigate(`/objects/${newObject._id}`);
              break;

            case "saveAndClose":
              navigate("/objects/");
              break;

            case "saveAndCreateNew":
              const resetFields: any = {};
              Object.keys(getSchemaSchema.data.properties).forEach((key) => {
                resetFields[key] = null;
              });
              reset(resetFields);
              const selectedSchemaValue =
                getSchemas.isSuccess && getSchemas.data.find((option) => selectedSchema === option.id);
              setValue("schema", { label: selectedSchemaValue.name, value: selectedSchemaValue.id });
              break;
          }
        },
      },
    );
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <section className={styles.section}>
          <Heading1>{t("Create Object")}</Heading1>

          <div className={styles.buttons}>
            <FormSaveButton disabled={loading} {...{ setAfterSuccessfulFormSubmit }} />
          </div>
        </section>

        <div className={styles.gridContainer}>
          <div className={styles.grid}>
            {!predefinedSchema && (
              <FormField>
                <FormFieldInput>
                  <FormFieldLabel>{t("Select a schema")}</FormFieldLabel>

                  {getSchemas.isLoading && <Skeleton height="50px" />}
                  {getSchemas.isSuccess && (
                    <SelectSingle
                      options={getSchemas.data.map((schema: any) => ({ label: schema.name, value: schema.id }))}
                      name="schema"
                      validation={enrichValidation({ required: true })}
                      {...{ register, errors, control }}
                      disabled={loading || getSchemaSchema.isLoading}
                    />
                  )}
                </FormFieldInput>
              </FormField>
            )}

            {predefinedSchema && (
              <FormField>
                <FormFieldInput>
                  <FormFieldLabel>{t("Selected schema")}</FormFieldLabel>

                  <InputText
                    disabled
                    defaultValue={predefinedSchema}
                    name="schema"
                    {...{ register, errors, control }}
                  />
                </FormFieldInput>
              </FormField>
            )}
          </div>
        </div>

        <Divider />

        <div>
          {getSchemaSchema.isLoading && <Skeleton height="200px" />}
          {getSchemaSchema.isSuccess && (
            <SchemaFormTemplate {...{ register, errors, control }} schema={getSchemaSchema.data} disabled={loading} />
          )}
        </div>
      </form>
    </div>
  );
};

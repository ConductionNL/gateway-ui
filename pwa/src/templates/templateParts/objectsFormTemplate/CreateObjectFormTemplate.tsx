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
import ObjectSaveButton from "../objectsFormSaveButton/ObjectSaveButton";

interface CreateObjectFormTemplateProps {
  predefinedSchema?: string;
}

export const CreateObjectFormTemplate: React.FC<CreateObjectFormTemplateProps> = ({ predefinedSchema }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [selectedSchema, setSelectedSchema] = React.useState<any>(null);
  const [closeForm, setCloseForm] = React.useState<boolean>(false);

  const queryClient = useQueryClient();
  const _useObjects = useObject(queryClient);
  const createOrEditObject = _useObjects.createOrEdit(undefined, closeForm);

  const _useSchema = useSchema(queryClient);
  const getSchemas = _useSchema.getAll();
  const getSchemaSchema = _useSchema.getSchema(selectedSchema);

  const {
    watch,
    register,
    handleSubmit,
    control,
    reset,
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

  const onSave = (data: any): void => {
    if (!selectedSchema) return;
    setCloseForm(false);

    delete data.schema;
    createOrEditObject.mutate({ payload: mapSelectInputFormData(data), entityId: selectedSchema });
  };

  const onSaveAndClose = (data: any): void => {
    if (!selectedSchema) return;
    setCloseForm(true);

    delete data.schema;
    createOrEditObject.mutate({ payload: mapSelectInputFormData(data), entityId: selectedSchema });
  };

  const onSaveAndCreate = (data: any): void => {
    if (!selectedSchema) return;
    setCloseForm(false);

    delete data.schema;
    createOrEditObject.mutate({ payload: mapSelectInputFormData(data), entityId: selectedSchema });

    const resetFields: any = {};
    // @ts-ignore
    Object.keys(getSchemaSchema.data?.properties).forEach((key) => {
      resetFields[key] = null;
    });
    reset(resetFields);
  };

  return (
    <div className={styles.container}>
      <form>
        <section className={styles.section}>
          <Heading1>{t("Create Object")}</Heading1>

          <div className={styles.buttons}>
            <ObjectSaveButton
              onSave={handleSubmit(onSave)}
              onSaveClose={handleSubmit(onSaveAndClose)}
              onSaveCreateNew={handleSubmit(onSaveAndCreate)}
            />
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
                      validation={{ required: true }}
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

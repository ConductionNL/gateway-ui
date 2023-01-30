import * as React from "react";
import * as styles from "./SchemasFormTemplate.module.css";
import { useForm } from "react-hook-form";
import FormField, { FormFieldInput, FormFieldLabel } from "@gemeente-denhaag/form-field";
import { Button } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { InputText, Textarea } from "@conduction/components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import { useQueryClient } from "react-query";
import { useSchema } from "../../../hooks/schema";
import { ErrorMessage } from "../../../components/errorMessage/ErrorMessage";
import clsx from "clsx";

interface EditSchemaFormTemplateProps {
  schema: any;
  schemaId: string;
}

export const EditSchemasFormTemplate: React.FC<EditSchemaFormTemplateProps> = ({ schema, schemaId }) => {
  const { t } = useTranslation();

  const [loading, setLoading] = React.useState<boolean>(false);

  const queryClient = useQueryClient();
  const _useSchema = useSchema(queryClient);
  const createOrEditSchema = _useSchema.createOrEdit(schemaId);
  const deleteSchema = _useSchema.remove();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  const onSubmit = (data: any): void => {
    createOrEditSchema.mutate({ payload: data, id: schemaId });
    queryClient.setQueryData(["entities", schemaId], data);
  };

  const handleSetFormValues = (schema: any): void => {
    const basicFields: string[] = ["name", "description", "reference"];
    basicFields.forEach((field) => setValue(field, schema[field]));
  };

  React.useEffect(() => {
    handleSetFormValues(schema);
  }, []);

  React.useEffect(() => {
    if (createOrEditSchema.isLoading || deleteSchema.isLoading) {
      setLoading(true);
      return;
    }

    setLoading(false);
  }, [createOrEditSchema.isLoading, deleteSchema.isLoading]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <section className={styles.section}>
        <div className={styles.buttons}>
          <Button className={clsx(styles.buttonIcon, styles.button)} type="submit" disabled={loading}>
            <FontAwesomeIcon icon={faFloppyDisk} />
            {t("Save")}
          </Button>
        </div>
      </section>

      <div className={styles.gridContainer}>
        <div className={styles.grid}>
          <FormField>
            <FormFieldInput>
              <FormFieldLabel>{t("Name")}</FormFieldLabel>
              <InputText
                {...{ register, errors }}
                name="name"
                validation={{ required: true, maxLength: 225 }}
                disabled={loading}
              />
              {errors["name"] && <ErrorMessage message={errors["name"].message} />}
            </FormFieldInput>
          </FormField>

          <FormField>
            <FormFieldInput>
              <FormFieldLabel>{t("Description")}</FormFieldLabel>
              <Textarea {...{ register, errors }} name="description" disabled={loading} />
            </FormFieldInput>
          </FormField>

          <FormFieldInput>
            <FormFieldLabel>{t("Reference")}</FormFieldLabel>
            <InputText {...{ register, errors }} name="reference" disabled={loading} validation={{ maxLength: 225 }} />
            {errors["reference"] && <ErrorMessage message={errors["reference"].message} />}
          </FormFieldInput>
        </div>
      </div>
    </form>
  );
};

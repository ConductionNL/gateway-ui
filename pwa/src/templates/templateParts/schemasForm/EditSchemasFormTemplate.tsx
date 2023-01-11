import * as React from "react";
import * as styles from "./SchemasFormTemplate.module.css";
import { useForm } from "react-hook-form";
import FormField, { FormFieldInput, FormFieldLabel } from "@gemeente-denhaag/form-field";
import { Button } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { InputText, SelectSingle, Textarea } from "@conduction/components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import { useQueryClient } from "react-query";
import { useSchema } from "../../../hooks/schema";
import { ErrorMessage } from "../../../components/errorMessage/ErrorMessage";

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

  const functionSelectOptions = [
    { label: "No Function", value: "noFunction" },
    { label: "Organization", value: "organization" },
    { label: "Person", value: "person" },
    { label: "User", value: "user" },
    { label: "User Group", value: "userGroup" },
    { label: "Processing Log", value: "processingLog" },
  ];

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm();

  const onSubmit = (data: any): void => {
    data = { ...data, function: data.function.value };

    createOrEditSchema.mutate({ payload: data, id: schemaId });
    queryClient.setQueryData(["entities", schemaId], data);
  };

  const handleSetFormValues = (schema: any): void => {
    const basicFields: string[] = ["name", "description", "function", "reference"];
    basicFields.forEach((field) => setValue(field, schema[field]));

    setValue(
      "function",
      functionSelectOptions.find((option) => schema.function === option.value),
    );
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
    <div className={styles.container}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <section className={styles.section}>
          <div className={styles.buttons}>
            <Button className={styles.buttonIcon} type="submit" disabled={loading}>
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

            <FormField>
              <FormFieldInput>
                <FormFieldLabel>{t("Function")}</FormFieldLabel>
                {/* @ts-ignore */}
                <SelectSingle
                  name="function"
                  options={functionSelectOptions}
                  {...{ control, errors }}
                  validation={{ required: true }}
                  disabled={loading}
                />
              </FormFieldInput>
            </FormField>

            <FormFieldInput>
              <FormFieldLabel>{t("Reference")}</FormFieldLabel>
              <InputText
                {...{ register, errors }}
                name="reference"
                disabled={loading}
                validation={{ maxLength: 225 }}
              />
              {errors["reference"] && <ErrorMessage message={errors["reference"].message} />}
            </FormFieldInput>
          </div>
        </div>
      </form>
    </div>
  );
};

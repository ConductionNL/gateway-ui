import * as React from "react";
import * as styles from "./SchemasFormTemplate.module.css";
import { useForm } from "react-hook-form";
import FormField, { FormFieldInput, FormFieldLabel } from "@gemeente-denhaag/form-field";
import { Button, Heading1 } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { InputText, Textarea } from "@conduction/components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import { useQueryClient } from "react-query";
import { useSchema } from "../../../hooks/schema";
import { ErrorMessage } from "../../../components/errorMessage/ErrorMessage";
import clsx from "clsx";

interface CreateSchemasFormTemplateProps {
  schemaId?: string;
}

export const CreateSchemasFormTemplate: React.FC<CreateSchemasFormTemplateProps> = ({ schemaId }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = React.useState<boolean>(false);

  const queryClient = useQueryClient();
  const _useSchema = useSchema(queryClient);
  const createOrEditSchema = _useSchema.createOrEdit(schemaId);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data: any): void => {
    createOrEditSchema.mutate({ payload: data, id: schemaId });
  };

  React.useEffect(() => {
    setLoading(createOrEditSchema.isLoading);
  }, [createOrEditSchema.isLoading]);

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <section className={styles.section}>
          <Heading1>{t("Create Schema")}</Heading1>

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

            <FormField>
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
            </FormField>
          </div>
        </div>
      </form>
    </div>
  );
};

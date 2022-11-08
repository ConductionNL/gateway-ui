import * as React from "react";
import * as styles from "./SchemasFormTemplate.module.css";
import { useForm } from "react-hook-form";
import APIContext from "../../../apiService/apiContext";
import FormField, { FormFieldInput, FormFieldLabel } from "@gemeente-denhaag/form-field";
import { Alert, Button, Heading1 } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import APIService from "../../../apiService/apiService";
import { InputText, SelectSingle, Textarea } from "@conduction/components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk, faMinus, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useQueryClient } from "react-query";
import clsx from "clsx";
import { useSchema } from "../../../hooks/schema";
import { useDashboardCard } from "../../../hooks/useDashboardCard";

interface EditCronjobFormTemplateProps {
  schema: any;
  schemaId: string;
}

export const EditSchemasFormTemplate: React.FC<EditCronjobFormTemplateProps> = ({ schema, schemaId }) => {
  const { t } = useTranslation();
  const { addOrRemoveDashboardCard, getDashboardCard } = useDashboardCard();

  const API: APIService | null = React.useContext(APIContext);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [formError, setFormError] = React.useState<string>("");

  const queryClient = useQueryClient();
  const _useSchema = useSchema(queryClient);
  const createOrEditSchema = _useSchema.createOrEdit(schemaId);
  const deleteSchema = _useSchema.remove();

  const dashboardCard = getDashboardCard(schema.name);

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
  };

  const handleDeleteSchema = () => {
    const confirmDeletion = confirm("Are you sure you want to delete this action?");

    if (confirmDeletion) {
      deleteSchema.mutate({ id: schemaId });
    }
  };

  const addOrRemoveFromDashboard = () => {
    addOrRemoveDashboardCard(schema.name, "Schema", "Entity", schemaId, dashboardCard?.id);
  };

  const handleSetFormValues = (cronjob: any): void => {
    const basicFields: string[] = ["name", "description", "function", "schema"];
    basicFields.forEach((field) => setValue(field, cronjob[field]));

    setValue(
      "function",
      functionSelectOptions.find((option) => cronjob.function === option.value),
    );
  };

  React.useEffect(() => {
    handleSetFormValues(schema);
  }, []);

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <section className={styles.section}>
          <Heading1>{t("Edit Schema")}</Heading1>

          <div className={styles.buttons}>
            <Button className={styles.buttonIcon} type="submit" disabled={loading}>
              <FontAwesomeIcon icon={faFloppyDisk} />
              {t("Save")}
            </Button>

            <Button className={styles.buttonIcon} onClick={addOrRemoveFromDashboard}>
              <FontAwesomeIcon icon={dashboardCard ? faMinus : faPlus} />
              {dashboardCard ? t("Remove from dashboard") : t("Add to dashboard")}
            </Button>

            <Button onClick={handleDeleteSchema} className={clsx(styles.buttonIcon, styles.deleteButton)}>
              <FontAwesomeIcon icon={faTrash} />
              {t("Delete")}
            </Button>
          </div>
        </section>
        {formError && <Alert text={formError} title={t("Oops, something went wrong")} variant="error" />}
        <div className={styles.gridContainer}>
          <div className={styles.grid}>
            <FormField>
              <FormFieldInput>
                <FormFieldLabel>{t("Name")}</FormFieldLabel>
                <InputText {...{ register, errors }} name="name" validation={{ required: true }} disabled={loading} />
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
              <FormFieldLabel>{t("Schema")}</FormFieldLabel>
              <InputText {...{ register, errors }} name="schema" validation={{ required: true }} disabled={loading} />
            </FormFieldInput>
          </div>
        </div>
      </form>
    </div>
  );
};

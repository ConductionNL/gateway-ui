import * as React from "react";
import * as styles from "./SchemesFormTemplate.module.css";
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
import { useScheme } from "../../../hooks/scheme";
import { useDashboardCards } from "../../../hooks/dashboardCards";

interface EditCronjobFormTemplateProps {
  scheme: any;
  schemeId?: string;
}

export const EditSchemesFormTemplate: React.FC<EditCronjobFormTemplateProps> = ({ scheme, schemeId }) => {
  const { t } = useTranslation();
  const API: APIService | null = React.useContext(APIContext);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [formError, setFormError] = React.useState<string>("");

  const queryClient = useQueryClient();
  const _useScheme = useScheme(queryClient);
  const createOrEditScheme = _useScheme.createOrEdit(schemeId);
  const deleteScheme = _useScheme.remove();

  const _useDashboardCards = useDashboardCards(queryClient);
  const getDashboardCards = _useDashboardCards.getAll();
  const mutateDashboardCard = _useDashboardCards.createOrDelete();

  const dashboardCard =
    getDashboardCards &&
    getDashboardCards.data?.find((dashboardCards: any) => dashboardCards.name === `dashboardCard-${scheme.name}`);

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

    createOrEditScheme.mutate({ payload: data, id: schemeId });
  };

  const handleDeleteScheme = () => {
    const confirmDeletion = confirm("Are you sure you want to delete this action?");

    if (confirmDeletion) {
      deleteScheme.mutate({ id: schemeId });
    }
  };

  const AddToDashboard = () => {
    const data = {
      name: `dashboardCard-${scheme.name}`,
      type: "Schema",
      entity: "Entity",
      object: "dashboardCard",
      entityId: schemeId,
      ordering: 1,
    };

    mutateDashboardCard.mutate({ payload: data, id: dashboardCard?.id });
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
    handleSetFormValues(scheme);
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

            <Button className={styles.buttonIcon} disabled={loading} onClick={AddToDashboard}>
              <FontAwesomeIcon icon={dashboardCard ? faMinus : faPlus} />
              {dashboardCard ? t("Remove from dashboard") : t("Add to dashboard")}
            </Button>

            <Button onClick={handleDeleteScheme} className={clsx(styles.buttonIcon, styles.deleteButton)}>
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

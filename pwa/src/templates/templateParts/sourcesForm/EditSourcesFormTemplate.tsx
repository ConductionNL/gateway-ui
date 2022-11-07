import * as React from "react";
import * as styles from "./SourcesFormTemplate.module.css";
import { useForm } from "react-hook-form";
import APIContext from "../../../apiService/apiContext";
import FormField, { FormFieldInput, FormFieldLabel } from "@gemeente-denhaag/form-field";
import { Alert, Button, Heading1 } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import APIService from "../../../apiService/apiService";
import { InputText, SelectSingle, Tag, Textarea } from "@conduction/components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsRotate, faFloppyDisk, faMinus, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useSource } from "../../../hooks/source";
import { useQueryClient } from "react-query";
import clsx from "clsx";
import { translateDate } from "../../../services/dateFormat";
import { useDashboardCards } from "../../../hooks/dashboardCards";
import { useDashboardCard } from "../../../hooks/useDashboardCard";

interface SourcesFormTemplateProps {
  source: any;
  sourceId: string;
}

export const SourcesFormTemplate: React.FC<SourcesFormTemplateProps> = ({ source, sourceId }) => {
  const { t, i18n } = useTranslation();
  const { addOrRemoveDashboardCard, getDashboardCard } = useDashboardCard();

  const API: APIService | null = React.useContext(APIContext);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [formError, setFormError] = React.useState<string>("");

  const [dashboardLoading, setDashboardLoading] = React.useState<boolean>(false);

  const queryClient = useQueryClient();
  const _useSources = useSource(queryClient);
  const createOrEditSource = _useSources.createOrEdit(sourceId);
  const deleteSource = _useSources.remove();

  const dashboardCard = getDashboardCard(source.name);

  const typeSelectOptions = [
    { label: "JSON", value: "json" },
    { label: "SML", value: "xml" },
    { label: "SOAP", value: "soap" },
    { label: "FTP", value: "ftp" },
    { label: "SFTP", value: "sftp" },
  ];

  const authSelectOptions = [
    { label: "API Key", value: "apikey" },
    { label: "JWT", value: "jwt" },
    { label: "Username and Password", value: "username-password" },
  ];

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  const onSubmit = (data: any): void => {
    data.type = data.type && data.type.value;
    data.auth = data.auth && data.auth.value;

    createOrEditSource.mutate({ payload: data, id: sourceId });
  };

  const handleDelete = (id: string): void => {
    deleteSource.mutateAsync({ id: id });
  };

  const addOrRemoveFromDashboard = () => {
    addOrRemoveDashboardCard(source.name, "Source", "Gateway", sourceId, dashboardCard?.id);
  };

  const handleSetFormValues = (source: any): void => {
    const basicFields: string[] = [
      "name",
      "status",
      "description",
      "location",
      "accept",
      "dateCreated",
      "dateModified",
      "documentation",
    ];
    basicFields.forEach((field) => setValue(field, source[field]));

    setValue(
      "type",
      typeSelectOptions.find((option) => source.type === option.value),
    );

    setValue(
      "auth",
      authSelectOptions.find((option) => source.auth === option.value),
    );
  };

  React.useEffect(() => {
    handleSetFormValues(source);
  }, []);

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <section className={styles.section}>
          <Heading1>{t("Edit Source")}</Heading1>

          <div className={styles.buttons}>
            <Button className={styles.buttonIcon} type="submit" disabled={loading}>
              <FontAwesomeIcon icon={faFloppyDisk} />
              {t("Save")}
            </Button>

            <Button className={styles.buttonIcon}>
              <FontAwesomeIcon icon={faArrowsRotate} />
              {t("Test connection")}
            </Button>

            <Button className={styles.buttonIcon} disabled={dashboardLoading} onClick={addOrRemoveFromDashboard}>
              <FontAwesomeIcon icon={dashboardCard ? faMinus : faPlus} />
              {dashboardCard ? t("Remove from dashboard") : t("Add to dashboard")}
            </Button>

            <Button className={clsx(styles.buttonIcon, styles.deleteButton)} onClick={() => handleDelete(source.id)}>
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
              <div
                className={clsx(
                  styles.flex,
                  styles.status,
                  styles[source.status === "Ok" ? "statusOk" : "statusFailed"],
                )}
              >
                <FormFieldLabel>{t("Status")}</FormFieldLabel>
                <Tag label={source.status ?? "-"} />
              </div>
            </FormField>
            <FormField>
              <FormFieldInput className={styles.flex}>
                <FormFieldLabel>{t("Created")}</FormFieldLabel>
                <Tag label={translateDate(i18n.language, source.dateCreated) ?? "-"} />
              </FormFieldInput>
            </FormField>
            <FormField>
              <FormFieldInput className={styles.flex}>
                <FormFieldLabel>{t("Modified")}</FormFieldLabel>
                <Tag label={translateDate(i18n.language, source.dateModified) ?? "-"} />
              </FormFieldInput>
            </FormField>
          </div>
          <FormField>
            <FormFieldInput>
              <FormFieldLabel>{t("Description")}</FormFieldLabel>
              <Textarea {...{ register, errors }} name="description" disabled={loading} />
            </FormFieldInput>
          </FormField>

          <div className={styles.grid}>
            <FormField>
              <FormFieldInput>
                <FormFieldLabel>{t("Location")}</FormFieldLabel>
                <InputText
                  {...{ register, errors }}
                  name="location"
                  validation={{ required: true }}
                  disabled={loading}
                />
              </FormFieldInput>
            </FormField>

            <FormField>
              <FormFieldInput>
                <FormFieldLabel>{t("ContentType")}</FormFieldLabel>
                {/* @ts-ignore */}
                <SelectSingle
                  name="type"
                  options={typeSelectOptions}
                  {...{ control, errors }}
                  validation={{ required: true }}
                  disabled={loading}
                />
              </FormFieldInput>
            </FormField>

            <FormField>
              <FormFieldInput>
                <FormFieldLabel>{t("accept")}</FormFieldLabel>
                <InputText {...{ register, errors }} name="accept" disabled={loading} />
              </FormFieldInput>
            </FormField>

            <FormField>
              <FormFieldInput>
                <FormFieldLabel>{t("authType")}</FormFieldLabel>
                {/* @ts-ignore */}
                <SelectSingle
                  {...{ register, errors, control }}
                  name="auth"
                  options={authSelectOptions}
                  validation={{ required: true }}
                  disabled={loading}
                />
              </FormFieldInput>
            </FormField>
            <FormField>
              <FormFieldInput>
                <FormFieldLabel>{t("Documentation")}</FormFieldLabel>
                <Textarea {...{ register, errors }} name="documentation" disabled={loading} />
              </FormFieldInput>
            </FormField>
          </div>
        </div>
      </form>
    </div>
  );
};

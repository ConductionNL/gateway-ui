import * as React from "react";
import * as styles from "./CronjobsFormTemplate.module.css";
import { useForm } from "react-hook-form";
import APIContext from "../../../apiService/apiContext";
import FormField, { FormFieldInput, FormFieldLabel } from "@gemeente-denhaag/form-field";
import { Alert, Button, Heading1 } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import APIService from "../../../apiService/apiService";
import { InputText, Textarea } from "@conduction/components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk, faMinus, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useQueryClient } from "react-query";
import clsx from "clsx";
import { useCronjob } from "../../../hooks/cronjob";
import { useDashboardCards } from "../../../hooks/dashboardCards";

interface EditCronjobFormTemplateProps {
  cronjob: any;
  cronjobId?: string;
}

export const EditCronjobFormTemplate: React.FC<EditCronjobFormTemplateProps> = ({ cronjob, cronjobId }) => {
  const { t } = useTranslation();
  const API: APIService | null = React.useContext(APIContext);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [formError, setFormError] = React.useState<string>("");
  const [dashboardLoading, setDashboardLoading] = React.useState<boolean>(false);

  const queryClient = useQueryClient();
  const _useCronjobs = useCronjob(queryClient);
  const createOrEditCronjob = _useCronjobs.createOrEdit(cronjobId);
  const deleteCronjob = _useCronjobs.remove();

  const _useDashboardCards = useDashboardCards(queryClient);
  const getDashboardCards = _useDashboardCards.getAll();
  const mutateDashboardCard = _useDashboardCards.createOrDelete();

  const dashboardCard =
    getDashboardCards &&
    getDashboardCards.data?.find((dashboardCards: any) => dashboardCards.name === `dashboardCard-${cronjob.name}`);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  const onSubmit = (data: any): void => {
    createOrEditCronjob.mutate({ payload: data, id: cronjobId });
  };

  const handleDelete = (id: string): void => {
    deleteCronjob.mutateAsync({ id: id });
  };

  const AddToDashboard = () => {
    setDashboardLoading(true);

    const data = {
      name: `dashboardCard-${cronjob.name}`,
      type: "Cronjob",
      entity: "Cronjob",
      object: "dashboardCard",
      entityId: cronjobId,
      ordering: 1,
    };

    mutateDashboardCard.mutate(
      { payload: data, id: dashboardCard?.id },
      {
        onSuccess: () => {
          setDashboardLoading(false);
        },
      },
    );
  };

  const handleSetFormValues = (cronjob: any): void => {
    const basicFields: string[] = ["name", "description", "crontab"];
    basicFields.forEach((field) => setValue(field, cronjob[field]));

    cronjob.throws.map((thrown: any, idx: number) => {
      setValue(`throws${idx}`, thrown);
    });
  };

  React.useEffect(() => {
    handleSetFormValues(cronjob);
  }, []);

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <section className={styles.section}>
          <Heading1>{t("Edit Cronjob")}</Heading1>

          <div className={styles.buttons}>
            <Button className={styles.buttonIcon} type="submit" disabled={loading}>
              <FontAwesomeIcon icon={faFloppyDisk} />
              {t("Save")}
            </Button>

            <Button className={styles.buttonIcon} disabled={dashboardLoading} onClick={AddToDashboard}>
              <FontAwesomeIcon icon={dashboardCard ? faMinus : faPlus} />
              {dashboardCard ? t("Remove from dashboard") : t("Add to dashboard")}
            </Button>

            <Button className={clsx(styles.buttonIcon, styles.deleteButton)}>
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
                <Textarea
                  {...{ register, errors }}
                  name="description"
                  validation={{ required: true }}
                  disabled={loading}
                />
              </FormFieldInput>
            </FormField>

            <FormField>
              <FormFieldInput>
                <FormFieldLabel>{t("Crontab")}</FormFieldLabel>
                <InputText
                  {...{ register, errors }}
                  name="crontab"
                  validation={{ required: true }}
                  disabled={loading}
                />
              </FormFieldInput>
            </FormField>

            <FormField>
              <FormFieldInput>
                <FormFieldLabel>{t("Throws")}</FormFieldLabel>
                {cronjob.throws.map((thrown: any, idx: number) => (
                  <InputText
                    {...{ register, errors }}
                    name={`throws${idx}`}
                    defaultValue={thrown.label}
                    validation={{ required: true }}
                    disabled={loading}
                  />
                ))}
              </FormFieldInput>
            </FormField>
          </div>
        </div>
      </form>
    </div>
  );
};

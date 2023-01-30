import * as React from "react";
import * as styles from "./CronjobsFormTemplate.module.css";
import { useForm } from "react-hook-form";
import FormField, { FormFieldInput, FormFieldLabel } from "@gemeente-denhaag/form-field";
import { Button, Heading1 } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { InputCheckbox, InputText, Tag, Textarea } from "@conduction/components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk, faMinus, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useQueryClient } from "react-query";
import clsx from "clsx";
import { useCronjob } from "../../../hooks/cronjob";
import { useDashboardCard } from "../../../hooks/useDashboardCard";
import { validateStringAsCronTab } from "../../../services/stringValidations";
import { ErrorMessage } from "../../../components/errorMessage/ErrorMessage";
import { predefinedSubscriberEvents } from "../../../data/predefinedSubscriberEvents";
import Skeleton from "react-loading-skeleton";
import { SelectCreate } from "@conduction/components/lib/components/formFields/select/select";
import { formatDateTime } from "../../../services/dateTime";

interface EditCronjobFormTemplateProps {
  cronjob: any;
  cronjobId: string;
}

export const EditCronjobFormTemplate: React.FC<EditCronjobFormTemplateProps> = ({ cronjob, cronjobId }) => {
  const { t, i18n } = useTranslation();
  const { toggleDashboardCard, getDashboardCard, loading: dashboardLoading } = useDashboardCard();

  const [loading, setLoading] = React.useState<boolean>(false);
  const [listensAndThrows, setListensAndThrows] = React.useState<any[]>([]);
  const [lastRun] = React.useState<string>(cronjob.lastRun);
  const [nextRun] = React.useState<string>(cronjob.nextRun);

  const queryClient = useQueryClient();
  const _useCronjobs = useCronjob(queryClient);
  const createOrEditCronjob = _useCronjobs.createOrEdit(cronjobId);
  const deleteCronjob = _useCronjobs.remove();

  const dashboardCard = getDashboardCard(cronjob.id);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    control,
  } = useForm();

  const onSubmit = (data: any): void => {
    const payload = {
      ...data,
      throws: data.throws?.map((_throw: any) => _throw.value),
    };

    createOrEditCronjob.mutate({ payload, id: cronjobId });
    queryClient.setQueryData(["cronjobs", cronjobId], payload);
  };

  const handleDelete = () => {
    deleteCronjob.mutate({ id: cronjobId });
  };

  const toggleFromDashboard = () => {
    toggleDashboardCard(cronjob.name, "cronjob", "Cronjob", cronjobId, dashboardCard?.id);
  };

  const handleSetFormValues = (cronjob: any): void => {
    const basicFields: string[] = ["name", "description", "crontab", "isEnabled"];
    basicFields.forEach((field) => setValue(field, cronjob[field]));

    setValue(
      "throws",
      cronjob["throws"]?.map((_throw: any) => ({ label: _throw, value: _throw })),
    );
  };

  React.useEffect(() => {
    setLoading(createOrEditCronjob.isLoading || dashboardLoading);
  }, [createOrEditCronjob.isLoading, dashboardLoading]);

  React.useEffect(() => {
    setListensAndThrows([...predefinedSubscriberEvents]);
  }, []);

  React.useEffect(() => {
    handleSetFormValues(cronjob);
  }, []);

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <section className={styles.section}>
          <Heading1>{`Edit ${cronjob.name}`}</Heading1>

          <div className={styles.buttons}>
            <Button className={clsx(styles.buttonIcon, styles.button)} type="submit" disabled={loading}>
              <FontAwesomeIcon icon={faFloppyDisk} />
              {t("Save")}
            </Button>

            <Button className={clsx(styles.buttonIcon, styles.button)} onClick={toggleFromDashboard} disabled={loading}>
              <FontAwesomeIcon icon={dashboardCard ? faMinus : faPlus} />
              {dashboardCard ? t("Remove from dashboard") : t("Add to dashboard")}
            </Button>

            <Button
              className={clsx(styles.buttonIcon, styles.button, styles.deleteButton)}
              onClick={handleDelete}
              disabled={loading}
            >
              <FontAwesomeIcon icon={faTrash} />
              {t("Delete")}
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
                <Textarea
                  {...{ register, errors }}
                  name="description"
                  validation={{ required: true, maxLength: 225 }}
                  disabled={loading}
                />
                {errors["description"] && <ErrorMessage message={errors["description"].message} />}
              </FormFieldInput>
            </FormField>

            <FormField>
              <FormFieldInput>
                <FormFieldLabel>{t("Crontab")}</FormFieldLabel>
                <InputText
                  {...{ register, errors }}
                  name="crontab"
                  validation={{ validate: validateStringAsCronTab, required: true }}
                  disabled={loading}
                />

                {errors["crontab"] && <ErrorMessage message={errors["crontab"].message} />}
              </FormFieldInput>
            </FormField>

            <FormField>
              <FormFieldInput>
                <FormFieldLabel>{t("Throws")}</FormFieldLabel>
                {listensAndThrows.length <= 0 && <Skeleton height="50px" />}

                {listensAndThrows.length > 0 && (
                  <SelectCreate
                    options={listensAndThrows}
                    disabled={loading}
                    name="throws"
                    {...{ register, errors, control }}
                  />
                )}
              </FormFieldInput>
              {errors["throws"] && <ErrorMessage message={errors["throws"].message} />}
            </FormField>

            <FormField>
              <FormFieldInput>
                <FormFieldLabel>{t("Last run")}</FormFieldLabel>
                <Tag label={formatDateTime(t(i18n.language), lastRun) ?? "-"} />
              </FormFieldInput>
            </FormField>

            <FormField>
              <FormFieldInput>
                <FormFieldLabel>{t("Next run")}</FormFieldLabel>
                <Tag label={formatDateTime(t(i18n.language), nextRun) ?? "-"} />
              </FormFieldInput>
            </FormField>

            <FormField>
              <FormFieldInput>
                <FormFieldLabel>{t("is Enabeld")}</FormFieldLabel>
                <InputCheckbox {...{ register, errors }} label="true" name="isEnabled" disabled={loading} />
              </FormFieldInput>
            </FormField>
          </div>
        </div>
      </form>
    </div>
  );
};

import * as React from "react";
import * as styles from "./CronjobsFormTemplate.module.css";
import { useForm } from "react-hook-form";
import FormField, { FormFieldInput, FormFieldLabel } from "@gemeente-denhaag/form-field";
import { Button, Heading1 } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { InputText, Textarea } from "@conduction/components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk, faMinus, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useQueryClient } from "react-query";
import clsx from "clsx";
import { useCronjob } from "../../../hooks/cronjob";

interface EditCronjobFormTemplateProps {
  cronjob: any;
  cronjobId: string;
}

export const EditCronjobFormTemplate: React.FC<EditCronjobFormTemplateProps> = ({ cronjob, cronjobId }) => {
  const { t } = useTranslation();

  const [loading, setLoading] = React.useState<boolean>(false);

  const queryClient = useQueryClient();
  const _useCronjobs = useCronjob(queryClient);
  const createOrUpdateCronjob = _useCronjobs.createOrUpdate(cronjobId);
  const deleteCronjob = _useCronjobs.remove();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  const onSubmit = (data: any): void => {
    createOrUpdateCronjob.mutate({ payload: data, id: cronjobId });
    queryClient.setQueryData(["cronjobs", cronjobId], data);
  };

  const handleDelete = (id: string): void => {
    deleteCronjob.mutateAsync({ id: id });
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

  React.useEffect(() => {
    setLoading(createOrUpdateCronjob.isLoading);
  }, [createOrUpdateCronjob]);

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <section className={styles.section}>
          <Heading1>{t("Edit Cronjob")}</Heading1>

          <div className={styles.buttonsContainer}>
            <Button type="submit" disabled={loading}>
              <FontAwesomeIcon icon={faFloppyDisk} />
              {t("Save")}
            </Button>

            <Button className={styles.deleteButton}>
              <FontAwesomeIcon icon={faTrash} />
              {t("Delete")}
            </Button>
          </div>
        </section>

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
              <InputText {...{ register, errors }} name="crontab" validation={{ required: true }} disabled={loading} />
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
      </form>
    </div>
  );
};

import * as React from "react";
import * as styles from "./ActionFormTemplate.module.css";
import { useForm } from "react-hook-form";
import APIContext from "../../../apiService/apiContext";
import FormField, { FormFieldInput, FormFieldLabel } from "@gemeente-denhaag/form-field";
import { Alert, Button, Heading1 } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import APIService from "../../../apiService/apiService";
import { InputCheckbox, InputNumber, InputText, Textarea } from "@conduction/components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useQueryClient } from "react-query";
import clsx from "clsx";
import { useAction } from "../../../hooks/action";
import { ValidateJson } from "../../../services/ValidateJson";

interface EditActionFormTemplateProps {
  action: any;
  actionId?: string;
}

export const EditActionFormTemplate: React.FC<EditActionFormTemplateProps> = ({ action, actionId }) => {
  const { t } = useTranslation();
  const API: APIService | null = React.useContext(APIContext);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [formError, setFormError] = React.useState<string>("");

  const queryClient = useQueryClient();
  const _useAction = useAction(queryClient);
  const createOrEditAction = _useAction.createOrEdit(actionId);
  const deleteAction = _useAction.remove();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  const onSubmit = (data: any): void => {
    if (ValidateJson(data.conditions)) data.conditions = JSON.parse(data.conditions)
	else return;

    createOrEditAction.mutate({ payload: data, id: actionId });
  };

  const handleDelete = (id: string): void => {
    deleteAction.mutateAsync({ id: id });
  };

  const handleSetFormValues = (cronjob: any): void => {
    const basicFields: string[] = ["name", "description", "listens", "priority", "async", "isLackable"];
    basicFields.forEach((field) => setValue(field, cronjob[field]));

    setValue("conditions", JSON.stringify(cronjob["conditions"], null, 4));
  };

  React.useEffect(() => {
    handleSetFormValues(action);
  }, []);

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <section className={styles.section}>
          <Heading1>{t("Edit Action")}</Heading1>

          <div className={styles.buttons}>
            <Button className={styles.buttonIcon} type="submit" disabled={loading}>
              <FontAwesomeIcon icon={faFloppyDisk} />
              {t("Save")}
            </Button>
            <Button className={clsx(styles.buttonIcon, styles.deleteButton)} disabled={loading}>
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
                <FormFieldLabel>{t("Listens")}</FormFieldLabel>
                <InputText
                  {...{ register, errors }}
                  name="listens"
                  validation={{ required: true }}
                  disabled={loading}
                />
              </FormFieldInput>
            </FormField>

            <FormField>
              <FormFieldInput>
                <FormFieldLabel>{t("Throws")}</FormFieldLabel>
                <InputText {...{ register, errors }} name="throws" validation={{ required: true }} disabled={loading} />
              </FormFieldInput>
            </FormField>

            <FormField>
              <FormFieldInput>
                <FormFieldLabel>{t("Class")}</FormFieldLabel>
                <InputText {...{ register, errors }} name="class" validation={{ required: true }} disabled={loading} />
              </FormFieldInput>
            </FormField>

            <FormField>
              <FormFieldInput>
                <FormFieldLabel>{t("Priority")}</FormFieldLabel>
                <InputNumber
                  {...{ register, errors }}
                  name="priority"
                  validation={{ required: true }}
                  disabled={loading}
                />
              </FormFieldInput>
            </FormField>

            <FormField>
              <FormFieldInput>
                <FormFieldLabel>{t("async")}</FormFieldLabel>
                <InputCheckbox {...{ register, errors }} label="on" name="async" validation={{ required: true }} />
              </FormFieldInput>
            </FormField>

            <FormField>
              <FormFieldInput>
                <FormFieldLabel>{t("IsLockable")}</FormFieldLabel>
                <InputCheckbox {...{ register, errors }} label="on" name="islockable" validation={{ required: true }} />
              </FormFieldInput>
            </FormField>

            <FormField>
              <FormFieldInput>
                <FormFieldLabel>{t("Conditions")}</FormFieldLabel>
                <Textarea {...{ register, errors }} name="conditions" disabled={loading} />
              </FormFieldInput>
            </FormField>
          </div>
        </div>
      </form>
    </div>
  );
};

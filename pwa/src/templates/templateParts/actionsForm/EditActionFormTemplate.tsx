import * as React from "react";
import * as styles from "./ActionFormTemplate.module.css";
import { useForm } from "react-hook-form";
import FormField, { FormFieldInput, FormFieldLabel } from "@gemeente-denhaag/form-field";
import { Button, Divider, Heading1 } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { InputCheckbox, InputNumber, InputText, Textarea } from "@conduction/components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useQueryClient } from "react-query";
import clsx from "clsx";
import { useAction } from "../../../hooks/action";
import { SchemaFormTemplate } from "../schemaForm/SchemaFormTemplate";
import { validateStringAsJSONArray } from "../../../services/validateStringAsJSONArray";
import { ErrorMessage } from "../../../components/errorMessage/ErrorMessage";

interface EditActionFormTemplateProps {
  action: any;
  actionId: string;
}

export const EditActionFormTemplate: React.FC<EditActionFormTemplateProps> = ({ action, actionId }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = React.useState<boolean>(false);

  const queryClient = useQueryClient();
  const _useAction = useAction(queryClient);
  const createOrEditAction = _useAction.createOrEdit(actionId);
  const deleteAction = _useAction.remove();

  console.log(action.actionHandlerConfiguration);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    control,
  } = useForm();

  const onSubmit = (data: any): void => {
    createOrEditAction.mutate({ payload: data, id: actionId });
  };

  const handleDeleteAction = () => {
    const confirmDeletion = confirm("Are you sure you want to delete this action?");

    if (confirmDeletion) {
      deleteAction.mutate({ id: actionId });
    }
  };

  const handleSetFormValues = (cronjob: any): void => {
    const basicFields: string[] = ["name", "description", "listens", "priority", "async", "isLackable"];
    basicFields.forEach((field) => setValue(field, cronjob[field]));

    setValue("conditions", JSON.stringify(cronjob["conditions"]));
  };

  React.useEffect(() => {
    handleSetFormValues(action);
  }, []);

  React.useEffect(() => {
    if (createOrEditAction.isLoading || deleteAction.isLoading) {
      setLoading(true);
      return;
    }

    setLoading(false);
  }, [createOrEditAction.isLoading, deleteAction.isLoading]);

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

            <Button
              onClick={handleDeleteAction}
              className={clsx(styles.buttonIcon, styles.deleteButton)}
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
                <FormFieldLabel>{t("Action handler")}</FormFieldLabel>
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
                <InputCheckbox
                  {...{ register, errors }}
                  disabled={loading}
                  label="on"
                  name="async"
                  validation={{ required: true }}
                />
              </FormFieldInput>
            </FormField>

            <FormField>
              <FormFieldInput>
                <FormFieldLabel>{t("IsLockable")}</FormFieldLabel>
                <InputCheckbox
                  {...{ register, errors }}
                  disabled={loading}
                  label="on"
                  name="islockable"
                  validation={{ required: true }}
                />
              </FormFieldInput>
            </FormField>

            <FormField>
              <FormFieldInput>
                <FormFieldLabel>{t("Conditions")}</FormFieldLabel>
                <Textarea
                  {...{ register, errors }}
                  name="conditions"
                  disabled={loading}
                  validation={{ validate: validateStringAsJSONArray }}
                />
                {errors["conditions"] && <ErrorMessage message={errors["conditions"].message} />}
              </FormFieldInput>
            </FormField>
          </div>

          {action.actionHandlerConfiguration && (
            <>
              <Divider />

              <SchemaFormTemplate
                {...{ register, errors, control }}
                schema={action.actionHandlerConfiguration}
                disabled={loading}
              />
            </>
          )}
        </div>
      </form>
    </div>
  );
};

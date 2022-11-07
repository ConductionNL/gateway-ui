import * as React from "react";
import * as styles from "./ActionFormTemplate.module.css";
import { set, useForm } from "react-hook-form";
import FormField, { FormFieldInput, FormFieldLabel } from "@gemeente-denhaag/form-field";
import { Button, Divider, Heading1 } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { InputCheckbox, InputNumber, InputText, Textarea, SelectSingle } from "@conduction/components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk, faTrash, faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useQueryClient } from "react-query";
import clsx from "clsx";
import { useAction } from "../../../hooks/action";
import { SchemaFormTemplate } from "../schemaForm/SchemaFormTemplate";
import { validateStringAsJSONArray } from "../../../services/validateStringAsJSONArray";
import { ErrorMessage } from "../../../components/errorMessage/ErrorMessage";
import Skeleton from "react-loading-skeleton";
import { useCronjob } from "../../../hooks/cronjob";
import { predefinedSubscriberEvents } from "../../../data/predefinedSubscriberEvents";
import { SelectCreate } from "@conduction/components/lib/components/formFields/select/select";
import { useDashboardCards } from "../../../hooks/dashboardCards";
import { useDashboardCard } from "../../../hooks/useDashboardCard";

interface EditActionFormTemplateProps {
  action: any;
  actionId: string;
}

export const EditActionFormTemplate: React.FC<EditActionFormTemplateProps> = ({ action, actionId }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [listensAndThrows, setListensAndThrows] = React.useState<any[]>([]);
  const [actionHandlerSchema, setActionHandlerSchema] = React.useState<any>(action.actionHandlerConfiguration);

  const queryClient = useQueryClient();
  const _useAction = useAction(queryClient);
  const createOrEditAction = _useAction.createOrEdit(actionId);
  const deleteAction = _useAction.remove();

  const _useCronjob = useCronjob(queryClient);
  const getCronjobs = _useCronjob.getAll();

  const { addOrRemoveDashboardCard, getDashboardCard } = useDashboardCard();

  const dashboardCard = getDashboardCard(action.name);

  const addOrRemoveFromDashboard = () => {
    addOrRemoveDashboardCard(action.name, "Action", "Action", actionId, dashboardCard?.id);
  };

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
      priority: parseInt(data.priority, 10),
      listens: data.listens?.map((listener: any) => listener.value),
      throws: data.throws?.map((_throw: any) => _throw.value),
      class: data.class.value,
      conditions: data.conditions ? JSON.parse(data.conditions) : [],
      configuration: {},
    };

    for (const [key, _] of Object.entries(actionHandlerSchema.properties)) {
      payload.configuration[key] = data[key];
      delete payload[key];
    }

    createOrEditAction.mutate({ payload, id: actionId });
  };

  const handleDeleteAction = () => {
    const confirmDeletion = confirm("Are you sure you want to delete this action?");

    if (confirmDeletion) {
      deleteAction.mutate({ id: actionId });
    }
  };

  const handleSetFormValues = (action: any): void => {
    const basicFields: string[] = ["name", "description", "priority", "async", "isLockable"];
    basicFields.forEach((field) => setValue(field, action[field]));

    setValue("conditions", JSON.stringify(action["conditions"]));

    setValue("class", { label: action.class, value: action.class });

    setValue(
      "listens",
      action["listens"].map((listen: any) => ({ label: listen, value: listen })),
    );

    setValue(
      "throws",
      action["throws"].map((_throw: any) => ({ label: _throw, value: _throw })),
    );

    if (actionHandlerSchema?.properties) {
      for (const [key, value] of Object.entries(actionHandlerSchema.properties)) {
        setValue(key, action.configuration[key]);

        const _value = value as any;

        setActionHandlerSchema((schema: any) => ({
          ...schema,
          properties: { ...schema.properties, [key]: { ..._value, value: action.configuration[key] } },
        }));
      }
    }
  };

  React.useEffect(() => {
    if (!getCronjobs.data) return;

    const cronjobs = getCronjobs.data.map((cronjob) => ({ label: cronjob.name, value: cronjob.name }));

    setListensAndThrows([...cronjobs, ...predefinedSubscriberEvents]);
  }, [getCronjobs.isSuccess]);

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

            <Button className={styles.buttonIcon} disabled={loading} onClick={addOrRemoveFromDashboard}>
              <FontAwesomeIcon icon={dashboardCard ? faMinus : faPlus} />
              {dashboardCard ? t("Remove from dashboard") : t("Add to dashboard")}
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
                {listensAndThrows.length <= 0 && <Skeleton height="50px" />}

                {listensAndThrows.length > 0 && (
                  /* @ts-ignore */
                  <SelectCreate
                    options={listensAndThrows}
                    disabled={loading}
                    name="listens"
                    {...{ register, errors, control }}
                  />
                )}
              </FormFieldInput>
            </FormField>

            <FormField>
              <FormFieldInput>
                <FormFieldLabel>{t("Throws")}</FormFieldLabel>
                {listensAndThrows.length <= 0 && <Skeleton height="50px" />}

                {listensAndThrows.length > 0 && (
                  /* @ts-ignore */
                  <SelectCreate
                    options={listensAndThrows}
                    disabled={loading}
                    name="throws"
                    {...{ register, errors, control }}
                  />
                )}
              </FormFieldInput>
            </FormField>

            <FormField>
              <FormFieldInput>
                <FormFieldLabel>{t("Action handler")}</FormFieldLabel>

                {/* @ts-ignore */}
                <SelectSingle
                  name="class"
                  validation={{ required: true }}
                  {...{ register, errors, control }}
                  disabled
                />
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
                <InputCheckbox {...{ register, errors }} disabled={loading} label="on" name="async" />
              </FormFieldInput>
            </FormField>

            <FormField>
              <FormFieldInput>
                <FormFieldLabel>{t("IsLockable")}</FormFieldLabel>
                <InputCheckbox {...{ register, errors }} disabled={loading} label="on" name="islockable" />
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

          {actionHandlerSchema && (
            <>
              <Divider />

              <SchemaFormTemplate {...{ register, errors, control }} schema={actionHandlerSchema} disabled={loading} />
            </>
          )}
        </div>
      </form>
    </div>
  );
};

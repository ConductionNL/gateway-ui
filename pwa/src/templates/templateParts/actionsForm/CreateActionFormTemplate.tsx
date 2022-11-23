import * as React from "react";
import * as styles from "./ActionFormTemplate.module.css";
import { useForm } from "react-hook-form";
import FormField, { FormFieldInput, FormFieldLabel } from "@gemeente-denhaag/form-field";
import { Button, Divider, Heading1 } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { InputCheckbox, InputNumber, InputText, Textarea, SelectSingle } from "@conduction/components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import { useQueryClient } from "react-query";
import { useAction } from "../../../hooks/action";
import { useCronjob } from "../../../hooks/cronjob";
import { predefinedSubscriberEvents } from "../../../data/predefinedSubscriberEvents";
import { SelectCreate } from "@conduction/components/lib/components/formFields/select/select";
import Skeleton from "react-loading-skeleton";
import { validateStringAsJSONArray } from "../../../services/validateStringAsJSONArray";
import { ErrorMessage } from "../../../components/errorMessage/ErrorMessage";
import { SchemaFormTemplate } from "../schemaForm/SchemaFormTemplate";
import RequiredStar from "../../../components/requiredStar/RequiredStar";

export const CreateActionFormTemplate: React.FC = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [listensAndThrows, setListensAndThrows] = React.useState<any[]>([]);
  const [selectedHanlderSchema, setSelectedHanlderSchema] = React.useState<any>(null);

  const queryClient = useQueryClient();

  const _useAction = useAction(queryClient);
  const createOrEditAction = _useAction.createOrEdit();
  const getAllHandlers = _useAction.getAllHandlers();

  const _useCronjob = useCronjob(queryClient);
  const getCronjobs = _useCronjob.getAll();

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm();

  const watchClass = watch("class");

  React.useEffect(() => {
    if (!watchClass || !getAllHandlers.data) return;

    const selectedHandler = getAllHandlers.data.find((handler) => handler.class === watchClass.value);

    setSelectedHanlderSchema(selectedHandler.configuration);
  }, [watchClass, getAllHandlers.isSuccess]);

  React.useEffect(() => {
    if (!getCronjobs.data) return;

    const cronjobs = getCronjobs.data.map((cronjob) => ({ label: cronjob.name, value: cronjob.name }));

    setListensAndThrows([...cronjobs, ...predefinedSubscriberEvents]);
  }, [getCronjobs.isSuccess]);

  React.useEffect(() => {
    if (getCronjobs.isLoading || createOrEditAction.isLoading) {
      setLoading(true);
      return;
    }

    setLoading(false);
  }, [getCronjobs.isLoading, createOrEditAction.isLoading]);

  const onSubmit = (data: any): void => {
    const payload = {
      ...data,
      listens: data.listens?.map((listener: any) => listener.value),
      throws: data.throws?.map((_throw: any) => _throw.value),
      class: data.class.value,
      conditions: data.conditions ? JSON.parse(data.conditions) : [],
      configuration: {},
    };

    for (const [key, _] of Object.entries(selectedHanlderSchema.properties)) {
      payload.configuration[key] = data[key];
      delete payload[key];
    }

    createOrEditAction.mutate({ payload });
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <section className={styles.section}>
          <Heading1>{t("Create Action")}</Heading1>

          <div className={styles.buttons}>
            <Button className={styles.buttonIcon} type="submit" disabled={loading}>
              <FontAwesomeIcon icon={faFloppyDisk} />
              {t("Save")}
            </Button>
          </div>
        </section>

        <div className={styles.gridContainer}>
          <div className={styles.grid}>
            <FormField>
              <FormFieldInput>
                <FormFieldLabel>
                  {t("Name")} <RequiredStar />
                </FormFieldLabel>
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
                <FormFieldLabel>
                  {t("Listens")} <RequiredStar />
                </FormFieldLabel>
                {listensAndThrows.length <= 0 && <Skeleton height="50px" />}

                {listensAndThrows.length > 0 && (
                  /* @ts-ignore */
                  <SelectCreate
                    options={listensAndThrows}
                    disabled={loading}
                    name="listens"
                    validation={{ required: true }}
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
                <FormFieldLabel>
                  {t("Action handler")} <RequiredStar />
                </FormFieldLabel>

                {getAllHandlers.isLoading && <Skeleton height="50px" />}

                {getAllHandlers.isSuccess && (
                  // @ts-ignore
                  <SelectSingle
                    options={getAllHandlers.data.map((handler: any) => ({
                      label: handler.class,
                      value: handler.class,
                    }))}
                    name="class"
                    validation={{ required: true }}
                    {...{ register, errors, control }}
                    disabled={loading}
                  />
                )}
              </FormFieldInput>
            </FormField>

            <FormField>
              <FormFieldInput>
                <FormFieldLabel>
                  {t("Priority")} <RequiredStar />
                </FormFieldLabel>
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
        </div>

        {selectedHanlderSchema && (
          <>
            <Divider />
            <SchemaFormTemplate {...{ register, errors, control }} schema={selectedHanlderSchema} disabled={loading} />
          </>
        )}
      </form>
    </div>
  );
};

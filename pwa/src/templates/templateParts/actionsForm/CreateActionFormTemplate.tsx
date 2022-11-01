import * as React from "react";
import * as styles from "./ActionFormTemplate.module.css";
import { useForm } from "react-hook-form";
import FormField, { FormFieldInput, FormFieldLabel } from "@gemeente-denhaag/form-field";
import { Button, Heading1 } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { InputCheckbox, InputNumber, InputText, Textarea } from "@conduction/components";
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

interface CreateActionFormTemplateProps {
  actionId?: string;
}

export const CreateActionFormTemplate: React.FC<CreateActionFormTemplateProps> = ({ actionId }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [listensAndThrows, setListensAndThrows] = React.useState<any[]>([]);

  const queryClient = useQueryClient();

  const _useAction = useAction(queryClient);
  const createOrEditAction = _useAction.createOrEdit(actionId);

  const _useCronjob = useCronjob(queryClient);
  const getCronjobs = _useCronjob.getAll();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

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
      priority: parseInt(data.priority, 10),
      listens: data.listens?.map((listener: any) => listener.value),
      throws: data.throws?.map((_throw: any) => _throw.value),
    };

    createOrEditAction.mutate({ payload, id: actionId });
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
      </form>
    </div>
  );
};

import * as React from "react";
import * as styles from "./SyncFormTemplate.module.css";
import { useForm } from "react-hook-form";
import FormField, { FormFieldInput, FormFieldLabel } from "@gemeente-denhaag/form-field";
import { Alert, Heading1 } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { InputText, SelectSingle } from "@conduction/components";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import { useQueryClient } from "react-query";
import { useSource } from "../../../hooks/source";
import Skeleton from "react-loading-skeleton";
import { useAction } from "../../../hooks/action";
import { useSync } from "../../../hooks/synchronization";
import { Button } from "../../../components/button/Button";
import { enrichValidation } from "../../../services/enrichReactHookFormValidation";

interface CreateSyncFormTemplateProps {
  objectId: string;
}

export const CreateSyncFormTemplate: React.FC<CreateSyncFormTemplateProps> = ({ objectId }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [formError, setFormError] = React.useState<string>("");

  const queryClient = useQueryClient();
  const _useSync = useSync(queryClient);
  const syncObject = _useSync.createOrEdit(objectId);

  const _useSource = useSource(queryClient);
  const getSources = _useSource.getAll();

  const _useAction = useAction(queryClient);
  const getActions = _useAction.getAll();

  const syncActions =
    getActions &&
    getActions.data?.filter((action) => action.class === "App\\ActionHandler\\SynchronizationItemHandler");

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const onSubmit = (data: any): void => {
    const payload = {
      ...data,
    };
    const sourceId = data.source.value;

    syncObject.mutate({ payload, objectId, sourceId });
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <section className={styles.section}>
          <Heading1>{t("Create Synchronization")}</Heading1>

          <div className={styles.buttons}>
            <Button label={t("Save")} variant="primary" icon={faSave} type="submit" disabled={loading} />
          </div>
        </section>
        {formError && <Alert text={formError} title={t("Oops, something went wrong")} variant="error" />}
        <div className={styles.gridContainer}>
          <div className={styles.grid}>
            <FormField>
              <FormFieldInput>
                <FormFieldLabel>{t("Select a source")}</FormFieldLabel>

                {getSources.isLoading && <Skeleton height="50px" />}
                {getSources.isSuccess && (
                  <SelectSingle
                    options={getSources.data.map((source: any) => ({ label: source.name, value: source.id }))}
                    name="source"
                    validation={enrichValidation({ required: true })}
                    {...{ register, errors, control }}
                    ariaLabel={t("Select a source")}
                  />
                )}
              </FormFieldInput>
            </FormField>
            <FormField>
              <FormFieldInput>
                <FormFieldLabel>{t("Select an Action")}</FormFieldLabel>

                {getActions.isLoading && <Skeleton height="50px" />}
                {getActions.isSuccess && syncActions && (
                  <SelectSingle
                    options={syncActions.map((action: any) => ({ label: action.name, value: action.id }))}
                    name="action"
                    {...{ register, errors, control }}
                    ariaLabel={t("Select an action")}
                  />
                )}
              </FormFieldInput>
            </FormField>
            <FormField>
              <FormFieldInput>
                <FormFieldLabel>{t("ExternalId")}</FormFieldLabel>
                <InputText
                  {...{ register, errors }}
                  name="externalId"
                  validation={enrichValidation({ maxLength: 225 })}
                  disabled={loading}
                  ariaLabel={t("Enter externalId")}
                />
              </FormFieldInput>
            </FormField>
            <FormField>
              <FormFieldInput>
                <FormFieldLabel>{t("Endpoint")}</FormFieldLabel>
                <InputText
                  {...{ register, errors }}
                  name="endpoint"
                  validation={enrichValidation({ required: true, maxLength: 225 })}
                  disabled={loading}
                  ariaLabel={t("Enter endpoint")}
                />
              </FormFieldInput>
            </FormField>
          </div>
        </div>
      </form>
    </div>
  );
};

import * as React from "react";
import * as styles from "./SyncFormTemplate.module.css";
import { useForm } from "react-hook-form";
import FormField, { FormFieldInput, FormFieldLabel } from "@gemeente-denhaag/form-field";
import { Heading1 } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { InputText, SelectSingle } from "@conduction/components";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import { useQueryClient } from "react-query";
import { ErrorMessage } from "../../../components/errorMessage/ErrorMessage";
import { useSource } from "../../../hooks/source";
import { useAction } from "../../../hooks/action";
import Skeleton from "react-loading-skeleton";
import { useSync } from "../../../hooks/synchronization";
import { Button } from "../../../components/button/Button";
import { enrichValidation } from "../../../services/enrichReactHookFormValidation";

interface EditSyncFormTemplateProps {
  objectId: string;
  syncId: string;
  sync: any;
}

export const EditSyncFormTemplate: React.FC<EditSyncFormTemplateProps> = ({ objectId, syncId, sync }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = React.useState<boolean>(false);

  const queryClient = useQueryClient();

  const _useSource = useSource(queryClient);
  const getSources = _useSource.getAll();
  const _useAction = useAction(queryClient);
  const getActions = _useAction.getAll();

  const _useSync = useSync(queryClient);
  const syncObject = _useSync.createOrEdit(objectId, syncId);

  const getSource = _useSource.getOne(sync?.gateway?.id);
  const getAction = _useAction.getOne(sync?.action?.id);

  const syncActions =
    getActions &&
    getActions.data?.filter((action) => action.class === "App\\ActionHandler\\SynchronizationItemHandler");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm();

  const onSubmit = (data: any): void => {
    const payload = {
      ...data,
    };

    const sourceId = data.source.value;

    syncObject.mutate({ objectId, sourceId, payload, syncId });
  };

  const handleSetFormValues = (sync: any): void => {
    const basicFields: string[] = ["endpoint"];
    basicFields.forEach((field) => setValue(field, sync[field]));
    setValue("externalId", sync.sourceId);
  };

  const handleSetSelectActionFormValues = (): void => {
    getAction && setValue("action", { label: getAction.data?.name, value: getAction.data?.id });
  };
  const handleSetSelectSourceFormValues = (): void => {
    getSource.isSuccess && setValue("source", { label: getSource.data.name, value: getSource.data.id });
  };

  React.useEffect(() => {
    handleSetFormValues(sync);
  }, [sync]);

  React.useEffect(() => {
    handleSetSelectActionFormValues();
  }, [getAction.isSuccess]);

  React.useEffect(() => {
    handleSetSelectSourceFormValues();
  }, [getSource.isSuccess]);

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <section className={styles.section}>
          <Heading1>{`Edit ${sync?.name}`}</Heading1>

          <div className={styles.buttons}>
            <Button label={t("Save")} variant="primary" icon={faSave} type="submit" disabled={loading} />
          </div>
        </section>
        <div className={styles.gridContainer}>
          <div className={styles.grid}>
            <FormField>
              <FormFieldInput>
                <FormFieldLabel>{t("Select a source")}</FormFieldLabel>

                {(getSources.isLoading || getSource.isLoading || getSource.isIdle) && <Skeleton height="50px" />}
                {getSources.isSuccess && getSource.isSuccess && (
                  <SelectSingle
                    options={getSources.data.map((source: any) => ({ label: source.name, value: source.id }))}
                    name="source"
                    validation={enrichValidation({ required: true })}
                    {...{ register, errors, control }}
                  />
                )}
              </FormFieldInput>
            </FormField>
            <FormField>
              <FormFieldInput>
                <FormFieldLabel>{t("Select a Action")}</FormFieldLabel>
                {sync?.action && (
                  <>
                    {getAction.isLoading && <Skeleton height="50px" />}
                    {getActions.isSuccess && syncActions && getAction.isSuccess && (
                      <SelectSingle
                        options={syncActions.map((action: any) => ({ label: action.name, value: action.id }))}
                        name="action"
                        {...{ register, errors, control }}
                      />
                    )}
                  </>
                )}
                {!sync?.action && (
                  <>
                    {(getActions.isLoading || !sync) && <Skeleton height="50px" />}
                    {getActions.isSuccess && syncActions && (
                      <SelectSingle
                        options={syncActions.map((action: any) => ({ label: action.name, value: action.id }))}
                        name="action"
                        {...{ register, errors, control }}
                      />
                    )}
                  </>
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
                />
                {errors["externalId"] && <ErrorMessage message={errors["externalId"].message} />}
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
                />
                {errors["endpoint"] && <ErrorMessage message={errors["endpoint"].message} />}
              </FormFieldInput>
            </FormField>
          </div>
        </div>
      </form>
    </div>
  );
};

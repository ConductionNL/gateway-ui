import * as React from "react";
import * as styles from "./SyncFormTemplate.module.css";
import { useForm } from "react-hook-form";
import FormField, { FormFieldInput, FormFieldLabel } from "@gemeente-denhaag/form-field";
import { useTranslation } from "react-i18next";
import { InputText, SelectSingle } from "@conduction/components";
import { useQueryClient } from "react-query";
import { ErrorMessage } from "../../../components/errorMessage/ErrorMessage";
import { useSource } from "../../../hooks/source";
import { useAction } from "../../../hooks/action";
import Skeleton from "react-loading-skeleton";
import { useSync } from "../../../hooks/synchronization";
import { useObject } from "../../../hooks/object";
import { useIsLoadingContext } from "../../../context/isLoading";

interface SyncFormTemplateProps {
  objectId: string;
  synchronization?: any;
}

export const formId: string = "synchronization-form";

export const SyncFormTemplate: React.FC<SyncFormTemplateProps> = ({ objectId, synchronization }) => {
  const { t } = useTranslation();
  const { setIsLoading, isLoading } = useIsLoadingContext();

  const queryClient = useQueryClient();
  const _useObject = useObject();
  const getObject = _useObject.getOne(objectId);

  const _useSource = useSource(queryClient);
  const getSource = _useSource.getOne(synchronization?.gateway?.id);
  const getSources = _useSource.getAll();

  const _useAction = useAction(queryClient);
  const getAction = _useAction.getOne(synchronization?.action?.id);
  const getActions = _useAction.getAll();

  const _useSync = useSync(queryClient);
  const syncObject = _useSync.createOrEdit(objectId, synchronization?.id);

  const syncActions =
    getActions &&
    getActions.data?.filter((action) => action.class === "App\\ActionHandler\\SynchronizationItemHandler");

  const syncId = synchronization?.id ?? null;

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm();

  const onSubmit = (data: any): void => {
    const payload = {
      ...data,
      entity: getObject.data._self.schema.id,
    };

    syncObject.mutate({ payload, objectId, syncId });
  };

  const handleSetFormValues = (sync: any): void => {
    const basicFields: string[] = ["endpoint", "sourceId"];
    basicFields.forEach((field) => setValue(field, sync[field]));
  };

  const handleSetSelectActionFormValues = (): void => {
    setValue("action", { label: getAction.data?.name, value: getAction.data?.id });
  };
  const handleSetSelectSourceFormValues = (): void => {
    setValue("source", { label: getSource.data.name, value: getSource.data.id });
  };

  React.useEffect(() => {
    synchronization && handleSetFormValues(synchronization);
    getAction.isSuccess && handleSetSelectActionFormValues();
    getSource.isSuccess && handleSetSelectSourceFormValues();
  }, [synchronization]);

  React.useEffect(() => {
    getActions.isSuccess && getAction.isSuccess && handleSetSelectActionFormValues();
  }, [getAction.isSuccess, getActions.isSuccess]);

  React.useEffect(() => {
    getSources.isSuccess && getSource.isSuccess && handleSetSelectSourceFormValues();
  }, [getSource.isSuccess]);

  React.useEffect(() => {
    setIsLoading({ syncForm: syncObject.isLoading });
  }, [syncObject.isLoading]);

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit(onSubmit)} id={formId}>
        <div className={styles.gridContainer}>
          <div className={styles.grid}>
            <FormField>
              <FormFieldInput>
                <FormFieldLabel>{t("Select a Source")}</FormFieldLabel>

                {synchronization && (
                  <>
                    {(getSources.isLoading || getSource.isLoading) && <Skeleton height="50px" />}

                    {getSources.isSuccess && getSource.isSuccess && (
                      <SelectSingle
                        options={getSources.data.map((source: any) => ({ label: source.name, value: source.id }))}
                        name="source"
                        disabled={isLoading.syncForm}
                        validation={{ required: true }}
                        {...{ register, errors, control }}
                      />
                    )}
                  </>
                )}

                {!synchronization && (
                  <>
                    {getSources.isLoading && <Skeleton height="50px" />}

                    {getSources.isSuccess && (
                      <SelectSingle
                        options={getSources.data.map((source: any) => ({ label: source.name, value: source.id }))}
                        name="source"
                        disabled={isLoading.syncForm}
                        validation={{ required: true }}
                        {...{ register, errors, control }}
                      />
                    )}
                  </>
                )}
              </FormFieldInput>
            </FormField>
            <FormField>
              <FormFieldInput>
                <FormFieldLabel>{t("Select a Action")}</FormFieldLabel>

                {synchronization && (
                  <>
                    {(getActions.isLoading || getAction.isLoading) && <Skeleton height="50px" />}

                    {getActions.isSuccess && getAction.isSuccess && syncActions && (
                      <SelectSingle
                        options={syncActions.map((action: any) => ({ label: action.name, value: action.id }))}
                        name="action"
                        disabled={isLoading.syncForm}
                        {...{ register, errors, control }}
                      />
                    )}
                  </>
                )}

                {!synchronization && (
                  <>
                    {getActions.isLoading && <Skeleton height="50px" />}

                    {getActions.isSuccess && syncActions && (
                      <SelectSingle
                        options={syncActions.map((action: any) => ({ label: action.name, value: action.id }))}
                        name="action"
                        disabled={isLoading.syncForm}
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
                  name="sourceId"
                  validation={{ maxLength: 225 }}
                  disabled={isLoading.syncForm}
                />
                {errors["sourceId"] && <ErrorMessage message={errors["sourceId"].message} />}
              </FormFieldInput>
            </FormField>

            <FormField>
              <FormFieldInput>
                <FormFieldLabel>{t("Endpoint")}</FormFieldLabel>
                <InputText
                  {...{ register, errors }}
                  name="endpoint"
                  validation={{ required: true, maxLength: 225 }}
                  disabled={isLoading.syncForm}
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

import * as React from "react";
import * as styles from "./SyncFormTemplate.module.css";
import { useForm } from "react-hook-form";
import FormField, { FormFieldInput, FormFieldLabel } from "@gemeente-denhaag/form-field";
import { Alert, Button, Heading1 } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { InputText, SelectSingle } from "@conduction/components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import { useQueryClient } from "react-query";
import { ErrorMessage } from "../../../components/errorMessage/ErrorMessage";
import { useSource } from "../../../hooks/source";
import Skeleton from "react-loading-skeleton";
import { useAction } from "../../../hooks/action";
import { useSync } from "../../../hooks/synchronization";

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

    const sync = syncObject.mutate({ payload, objectId, sourceId });
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <section className={styles.section}>
          <Heading1>{t("Create Synchronization")}</Heading1>

          <div className={styles.buttons}>
            <Button className={styles.buttonIcon} type="submit" disabled={loading}>
              <FontAwesomeIcon icon={faFloppyDisk} />

              {t("Save")}
            </Button>
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
                  // @ts-ignore
                  <SelectSingle
                    options={getSources.data.map((source: any) => ({ label: source.name, value: source.id }))}
                    name="source"
                    validation={{ required: true }}
                    {...{ register, errors, control }}
                  />
                )}
              </FormFieldInput>
            </FormField>
            <FormField>
              <FormFieldInput>
                <FormFieldLabel>{t("Select a Action")}</FormFieldLabel>

                {getActions.isLoading && <Skeleton height="50px" />}
                {getActions.isSuccess && syncActions && (
                  // @ts-ignore
                  <SelectSingle
                    options={syncActions.map((action: any) => ({ label: action.name, value: action.id }))}
                    name="action"
                    {...{ register, errors, control }}
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
                  validation={{ maxLength: 225 }}
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
                  validation={{ required: true, maxLength: 225 }}
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

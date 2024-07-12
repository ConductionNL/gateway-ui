import * as React from "react";
import * as styles from "./CronjobsFormTemplate.module.css";
import { useForm } from "react-hook-form";
import FormField, { FormFieldInput, FormFieldLabel } from "@gemeente-denhaag/form-field";
import { useTranslation } from "react-i18next";
import { InputCheckbox, InputText, Textarea } from "@conduction/components";
import { useQueryClient } from "react-query";
import { useCronjob } from "../../../hooks/cronjob";
import { validateStringAsCronTab } from "../../../services/stringValidations";
import { predefinedSubscriberEvents } from "../../../data/predefinedSubscriberEvents";
import Skeleton from "react-loading-skeleton";
import { SelectCreate, SelectSingle } from "@conduction/components/lib/components/formFields/select/select";
import { useIsLoadingContext } from "../../../context/isLoading";
import { enrichValidation } from "../../../services/enrichReactHookFormValidation";
import { useUser } from "../../../hooks/user";

interface CronjobFormTemplateProps {
  cronjob?: any;
}

export const formId: string = "cronjob-form";

export const CronjobFormTemplate: React.FC<CronjobFormTemplateProps> = ({ cronjob }) => {
  const { t } = useTranslation();
  const { setIsLoading, isLoading } = useIsLoadingContext();
  const [listensAndThrows, setListensAndThrows] = React.useState<any[]>([]);

  const queryClient = useQueryClient();
  const _useCronjobs = useCronjob(queryClient);
  const createOrEditCronjob = _useCronjobs.createOrEdit(cronjob?.id);

  const _useUsers = useUser(queryClient);
  const getUsers = _useUsers.getAll();

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm();

  React.useEffect(() => {
    setIsLoading({ cronjobForm: createOrEditCronjob.isLoading });
  }, [createOrEditCronjob.isLoading]);

  React.useEffect(() => {
    setListensAndThrows([...predefinedSubscriberEvents]);
  }, []);

  const onSubmit = (data: any): void => {
    const payload = {
      ...data,
      throws: data.throws?.map((_throw: any) => _throw.value),
      userId: data.userId?.value ?? null,
    };

    createOrEditCronjob.mutate({ payload, id: cronjob?.id });
  };

  const handleSetFormValues = (): void => {
    const basicFields: string[] = ["reference", "version", "name", "description", "crontab", "isEnabled"];
    basicFields.forEach((field) => setValue(field, cronjob[field]));

    setValue(
      "throws",
      cronjob["throws"]?.map((_throw: any) => ({ label: _throw, value: _throw })),
    );
  };

  const setUserIdLabel = (user: any): string => {
    return user.name + (" - " + user?.organization?.name);
  };

  React.useEffect(() => {
    cronjob && handleSetFormValues();
  }, [cronjob]);

  React.useEffect(() => {
    if (!cronjob) return;
    if (!getUsers.isSuccess) return;
    getUsers?.data.map((user) => {
      if (user?.id === cronjob?.userId) {
        setValue("userId", { label: setUserIdLabel(user), value: user.id });
      }
    });
  }, [cronjob, getUsers.isSuccess]);

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} id={formId}>
        <div className={styles.gridContainer}>
          <div className={styles.grid}>
            <FormField>
              <FormFieldInput>
                <FormFieldLabel>{t("Reference")}</FormFieldLabel>
                <InputText
                  {...{ register, errors }}
                  name="reference"
                  disabled={isLoading.cronjobForm}
                  ariaLabel={t("Enter reference")}
                />
              </FormFieldInput>
            </FormField>

            <FormField>
              <FormFieldInput>
                <FormFieldLabel>{t("Version")}</FormFieldLabel>
                <InputText
                  {...{ register, errors }}
                  name="version"
                  disabled={isLoading.cronjobForm}
                  defaultValue={cronjob?.version ?? "0.0.0"}
                  ariaLabel={t("Enter version")}
                />
              </FormFieldInput>
            </FormField>
            <FormField>
              <FormFieldInput>
                <FormFieldLabel>{t("Name")}</FormFieldLabel>
                <InputText
                  {...{ register, errors }}
                  name="name"
                  validation={enrichValidation({ required: true, maxLength: 225 })}
                  disabled={isLoading.cronjobForm}
                  ariaLabel={t("Enter name")}
                />
              </FormFieldInput>
            </FormField>

            <FormField>
              <FormFieldInput>
                <FormFieldLabel>{t("Description")}</FormFieldLabel>
                <Textarea
                  {...{ register, errors }}
                  name="description"
                  validation={enrichValidation({ required: true, maxLength: 225 })}
                  disabled={isLoading.cronjobForm}
                  ariaLabel={t("Enter description")}
                />
              </FormFieldInput>
            </FormField>

            <FormField>
              <FormFieldInput>
                <FormFieldLabel>{t("Crontab")}</FormFieldLabel>
                <InputText
                  {...{ register, errors }}
                  name="crontab"
                  validation={enrichValidation({ validate: validateStringAsCronTab, required: true })}
                  disabled={isLoading.cronjobForm}
                  ariaLabel={t("Enter crontab")}
                />
              </FormFieldInput>
            </FormField>

            <FormField>
              <FormFieldInput>
                <FormFieldLabel>{t("Throws")}</FormFieldLabel>
                {listensAndThrows.length <= 0 && <Skeleton height="50px" />}

                {listensAndThrows.length > 0 && (
                  <SelectCreate
                    options={listensAndThrows}
                    disabled={isLoading.cronjobForm}
                    name="throws"
                    {...{ register, errors, control }}
                    ariaLabel={t("Select or create a throw")}
                  />
                )}
              </FormFieldInput>
            </FormField>

            <FormField>
              <FormFieldInput>
                <FormFieldLabel>{t("User ID")}</FormFieldLabel>

                {getUsers.isLoading && <Skeleton height="50px" />}

                {getUsers.isSuccess && (
                  <SelectSingle
                    options={getUsers.data.map((user: any) => ({
                      label: setUserIdLabel(user),
                      value: user.id,
                    }))}
                    name="userId"
                    {...{ register, errors, control }}
                    disabled={isLoading.actionForm}
                    ariaLabel={t("Select an user as userId")}
                    isClearable={true}
                  />
                )}
              </FormFieldInput>
            </FormField>

            <FormField>
              <FormFieldInput>
                <FormFieldLabel>{t("isEnabled")}</FormFieldLabel>
                <InputCheckbox disabled={isLoading.cronjobForm} {...{ register, errors }} label="on" name="isEnabled" />
              </FormFieldInput>
            </FormField>
          </div>
        </div>
      </form>
    </div>
  );
};

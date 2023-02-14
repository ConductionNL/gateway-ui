import * as React from "react";
import * as styles from "./CronjobsFormTemplate.module.css";
import { useForm } from "react-hook-form";
import FormField, { FormFieldInput, FormFieldLabel } from "@gemeente-denhaag/form-field";
import { useTranslation } from "react-i18next";
import { InputCheckbox, InputText, Textarea } from "@conduction/components";
import { useQueryClient } from "react-query";
import { useCronjob } from "../../../hooks/cronjob";
import { validateStringAsCronTab } from "../../../services/stringValidations";
import { ErrorMessage } from "../../../components/errorMessage/ErrorMessage";
import { predefinedSubscriberEvents } from "../../../data/predefinedSubscriberEvents";
import Skeleton from "react-loading-skeleton";
import { SelectCreate } from "@conduction/components/lib/components/formFields/select/select";
import { useIsLoadingContext } from "../../../context/isLoading";

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
    };

    createOrEditCronjob.mutate({ payload, id: cronjob?.id });
  };

  const handleSetFormValues = (): void => {
    const basicFields: string[] = ["name", "description", "crontab", "isEnabled"];
    basicFields.forEach((field) => setValue(field, cronjob[field]));

    setValue(
      "throws",
      cronjob["throws"]?.map((_throw: any) => ({ label: _throw, value: _throw })),
    );
  };

  React.useEffect(() => {
    cronjob && handleSetFormValues();
  }, [cronjob]);

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} id={formId}>
        <div className={styles.gridContainer}>
          <div className={styles.grid}>
            <FormField>
              <FormFieldInput>
                <FormFieldLabel>{t("Name")}</FormFieldLabel>
                <InputText
                  {...{ register, errors }}
                  name="name"
                  validation={{ required: true, maxLength: 225 }}
                  disabled={isLoading.cronjobForm}
                />
                {errors["name"] && <ErrorMessage message={errors["name"].message} />}
              </FormFieldInput>
            </FormField>

            <FormField>
              <FormFieldInput>
                <FormFieldLabel>{t("Description")}</FormFieldLabel>
                <Textarea
                  {...{ register, errors }}
                  name="description"
                  validation={{ required: true, maxLength: 225 }}
                  disabled={isLoading.cronjobForm}
                />
                {errors["description"] && <ErrorMessage message={errors["description"].message} />}
              </FormFieldInput>
            </FormField>

            <FormField>
              <FormFieldInput>
                <FormFieldLabel>{t("Crontab")}</FormFieldLabel>
                <InputText
                  {...{ register, errors }}
                  name="crontab"
                  validation={{ validate: validateStringAsCronTab, required: true }}
                  disabled={isLoading.cronjobForm}
                />
                {errors["crontab"] && <ErrorMessage message={errors["crontab"].message} />}
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
                  />
                )}
                {errors["throws"] && <ErrorMessage message={errors["throws"].message} />}
              </FormFieldInput>
            </FormField>

            <FormField>
              <FormFieldInput>
                <FormFieldLabel>{t("is Enabeld")}</FormFieldLabel>
                <InputCheckbox disabled={isLoading.cronjobForm} {...{ register, errors }} label="on" name="isEnabled" />
              </FormFieldInput>
            </FormField>
          </div>
        </div>
      </form>
    </div>
  );
};

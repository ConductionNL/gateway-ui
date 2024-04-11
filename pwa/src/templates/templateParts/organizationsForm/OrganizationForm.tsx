import * as React from "react";
import * as styles from "./OrganizationFormTemplate.module.css";
import FormField, { FormFieldInput, FormFieldLabel } from "@gemeente-denhaag/form-field";
import { useTranslation } from "react-i18next";
import { InputText, SelectSingle, Textarea } from "@conduction/components";
import { useForm } from "react-hook-form";
import { useQueryClient } from "react-query";
import { useOrganization } from "../../../hooks/organization";
import { useDatabase } from "../../../hooks/database";
import { useIsLoadingContext } from "../../../context/isLoading";
import { enrichValidation } from "../../../services/enrichReactHookFormValidation";
import Skeleton from "react-loading-skeleton";

interface OrganizationFormProps {
  organization?: any;
}

export const formId: string = "organization-form";

export const OrganizationForm: React.FC<OrganizationFormProps> = ({ organization }) => {
  const { t } = useTranslation();
  const { setIsLoading, isLoading } = useIsLoadingContext();

  const queryClient = useQueryClient();
  const _useOrganizations = useOrganization(queryClient);
  const _useDatabases = useDatabase(queryClient);
  const getDatabases = _useDatabases.getAll();

  const createOrEditOrganization = _useOrganizations.createOrEdit(organization?.id);
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm();

  const handleSetFormValues = (organization: any): void => {
    const basicFields: string[] = ["name", "description", "organization"];
    basicFields.forEach((field) => setValue(field, organization[field]));
    setValue("database", { label: organization?.database?.name, value: organization?.database?.id });
  };

  React.useEffect(() => {
    setIsLoading({ organizationForm: createOrEditOrganization.isLoading });
  }, [createOrEditOrganization.isLoading]);

  React.useEffect(() => {
    organization && handleSetFormValues(organization);
  }, [organization]);

  const onSubmit = (data: any): void => {
    const payload = {
      ...data,
      database: data.database && `/admin/databases/${data.database.value}`,
    };
    createOrEditOrganization.mutate({ payload: payload, id: organization?.id });

    organization?.id && queryClient.setQueryData(["organizations", organization.id], data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.formContainer} id={formId}>
      <div className={styles.gridContainer}>
        <div className={styles.grid}>
          <FormField>
            <FormFieldInput>
              <FormFieldLabel>{t("Name")}</FormFieldLabel>
              <InputText
                {...{ register, errors }}
                name="name"
                validation={enrichValidation({ required: true })}
                disabled={isLoading.organizationForm}
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
                validation={enrichValidation({ required: true })}
                disabled={isLoading.organizationForm}
                ariaLabel={t("Enter description")}
              />
            </FormFieldInput>
          </FormField>
          <FormField>
            <FormFieldInput>
              <FormFieldLabel>{t("Database")}</FormFieldLabel>

              {getDatabases.isLoading && <Skeleton height="50px" />}
              {getDatabases.isSuccess && (
                <SelectSingle
                  options={getDatabases.data.map((database: any) => ({
                    label: database.name,
                    value: database.id,
                  }))}
                  name="database"
                  {...{ register, errors, control }}
                  disabled={isLoading.applicationForm}
                  ariaLabel={t("Select a database")}
                />
              )}
            </FormFieldInput>
          </FormField>
        </div>
      </div>
    </form>
  );
};

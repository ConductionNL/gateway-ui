import * as React from "react";
import * as styles from "./DatabaseFormTemplate.module.css";
import FormField, { FormFieldInput, FormFieldLabel } from "@gemeente-denhaag/form-field";
import { useTranslation } from "react-i18next";
import { InputPassword, InputText, SelectMultiple, SelectSingle, Textarea } from "@conduction/components";
import { useForm } from "react-hook-form";
import { useQueryClient } from "react-query";
import { useDatabase } from "../../../hooks/database";
import Skeleton from "react-loading-skeleton";
import { validatePassword } from "../../../services/stringValidations";
import { useOrganization } from "../../../hooks/organization";
import { useIsLoadingContext } from "../../../context/isLoading";
import { useApplication } from "../../../hooks/application";
import { IKeyValue } from "@conduction/components/lib/components/formFields";
import { useSecurityGroup } from "../../../hooks/securityGroup";
import { enrichValidation } from "../../../services/enrichReactHookFormValidation";

interface DatabaseFormTemplateProps {
  database?: any;
}

export const formId: string = "database-form";

export const DatabaseFormTemplate: React.FC<DatabaseFormTemplateProps> = ({ database }) => {
  const { t } = useTranslation();
  const { setIsLoading, isLoading } = useIsLoadingContext();

  const queryClient = useQueryClient();
  const createOrEditDatabase = useDatabase(queryClient).createOrEdit(database?.id);

  const getOrganization = useOrganization(queryClient).getAll();

  const organizationOptions = getOrganization.data?.map((_organization: any) => ({
    label: _organization.name,
    value: _organization.id,
  }));

  const _useOrganizations = useOrganization(queryClient);
  const getOrganizations = _useOrganizations.getAll();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitted },
    control,
    watch,
    trigger,
  } = useForm();

  const handleSetFormValues = (database: any): void => {
    const basicFields: string[] = ["reference", "name", "description", "version"];
    basicFields.forEach((field) => setValue(field, database[field]));

    setValue(
      "organizations",
      database.organizations.map((organization: any) => ({ label: organization.name, value: organization.id })),
    );
  };

  const onSubmit = (data: any): void => {
    const payload = {
      ...data,
      organizations:
        data.organizations &&
        data.organizations.map((organization: any) => `/admin/organizations/${organization.value}`),
    };

    data.uri === "" && delete payload.uri;

    createOrEditDatabase.mutate({ payload, id: database?.id });
    database?.id && queryClient.setQueryData(["databases", database.id], data);
  };

  React.useEffect(() => {
    setIsLoading({ databaseForm: createOrEditDatabase.isLoading });
  }, [createOrEditDatabase.isLoading]);

  React.useEffect(() => {
    database && handleSetFormValues(database);
  }, [database]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} id={formId} className={styles.formContainer}>
      <div className={styles.gridContainer}>
        <div className={styles.grid}>
          <FormField>
            <FormFieldInput>
              <FormFieldLabel>{t("Name")}</FormFieldLabel>
              <InputText
                {...{ register, errors }}
                name="name"
                validation={enrichValidation({ required: true })}
                disabled={isLoading.databaseForm}
                // ariaLabel={t("Enter name")}
              />
            </FormFieldInput>
          </FormField>
          <FormField>
            <FormFieldInput>
              <FormFieldLabel>{t("Reference")}</FormFieldLabel>
              <InputText
                {...{ register, errors }}
                name="reference"
                validation={enrichValidation({ required: true })}
                disabled={isLoading.databaseForm}
                // ariaLabel={t("Enter name")}
              />
            </FormFieldInput>
          </FormField>

          <FormField>
            <FormFieldInput>
              <FormFieldLabel>{t("Description")}</FormFieldLabel>
              <Textarea
                {...{ register, errors }}
                name="description"
                disabled={isLoading.databaseForm}
                // ariaLabel={t("Enter description")}
              />
            </FormFieldInput>
          </FormField>

          <FormField>
            <FormFieldInput>
              <FormFieldLabel>{t("Version")}</FormFieldLabel>
              <InputText
                {...{ register, errors }}
                name="version"
                disabled={isLoading.databaseForm}
                defaultValue={database?.version ?? "0.0.0"}
                // ariaLabel={t("Enter version")}
              />
            </FormFieldInput>
          </FormField>

          <FormField>
            <FormFieldInput>
              <FormFieldLabel>{t("Select organizations")}</FormFieldLabel>

              {getOrganizations.isLoading && <Skeleton height="50px" />}
              {getOrganizations.isSuccess && (
                <SelectMultiple
                  options={getOrganizations.data.map((organization: any) => ({
                    label: organization.name,
                    value: organization.id,
                  }))}
                  name="organizations"
                  {...{ register, errors, control }}
                  disabled={isLoading.databaseForm}
                  // ariaLabel={t("Select one or more organizations")}
                />
              )}
            </FormFieldInput>
          </FormField>

          <FormField>
            <FormFieldInput>
              <FormFieldLabel>{t("Uri (write only)")}</FormFieldLabel>
              <InputText
                {...{ register, errors }}
                name="uri"
                disabled={isLoading.databaseForm}
                // ariaLabel={t("Enter password")}
              />
            </FormFieldInput>
          </FormField>
        </div>
      </div>
    </form>
  );
};

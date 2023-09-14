import * as React from "react";
import * as styles from "./UserFormTemplate.module.css";
import FormField, { FormFieldInput, FormFieldLabel } from "@gemeente-denhaag/form-field";
import { useTranslation } from "react-i18next";
import { InputPassword, InputText, SelectMultiple, SelectSingle, Textarea } from "@conduction/components";
import { useForm } from "react-hook-form";
import { useQueryClient } from "react-query";
import { useUser } from "../../../hooks/user";
import Skeleton from "react-loading-skeleton";
import { validatePassword } from "../../../services/stringValidations";
import { useOrganization } from "../../../hooks/organization";
import { useIsLoadingContext } from "../../../context/isLoading";
import { useApplication } from "../../../hooks/application";
import { IKeyValue } from "@conduction/components/lib/components/formFields";
import { useSecurityGroup } from "../../../hooks/securityGroup";
import { enrichValidation } from "../../../services/enrichReactHookFormValidation";

interface UserFormTemplateProps {
  user?: any;
}

export const formId: string = "user-form";

export const UserFormTemplate: React.FC<UserFormTemplateProps> = ({ user }) => {
  const { t } = useTranslation();
  const { setIsLoading, isLoading } = useIsLoadingContext();

  const queryClient = useQueryClient();
  const createOrEditUser = useUser(queryClient).createOrEdit(user?.id);

  const getOrganization = useOrganization(queryClient).getAll();
  const getApplications = useApplication(queryClient).getAll();
  const getSecurityGroups = useSecurityGroup(queryClient).getAll();

  const organisationOptions = getOrganization.data?.map((_organisation: any) => ({
    label: _organisation.name,
    value: _organisation.id,
  }));

  const applicationOptions = getApplications.data?.map((application: any) => ({
    label: application.name,
    value: application.id,
  }));

  const securityGroupOptions = getSecurityGroups.data?.map((securityGroup: any) => ({
    label: securityGroup.name,
    value: securityGroup.id,
  }));

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitted },
    control,
    watch,
    trigger,
  } = useForm();

  const password = watch("password");
  const validationPassword = watch("validation_password");

  React.useEffect(() => {
    if (isSubmitted) {
      trigger("password");
      trigger("validation_password");
    }
  }, [password, validationPassword]);

  const handleSetFormValues = (user: any): void => {
    const basicFields: string[] = ["name", "description", "email", "password", "locale", "person"];
    basicFields.forEach((field) => setValue(field, user[field]));

    setValue(
      "applications",
      user.applications.map((application: any) => ({ label: application.name, value: application.id })),
    );

    setValue(
      "securityGroups",
      user.securityGroups.map((securityGroup: any) => ({ label: securityGroup.name, value: securityGroup.id })),
    );
  };

  const onSubmit = (data: any): void => {
    const payload = {
      ...data,
      organisation: data.organization && `/admin/organisations/${data.organization.value}`,
      applications: data.applications?.map((application: IKeyValue) => `/admin/applications/${application.value}`),
      securityGroups: data.securityGroups?.map(
        (securityGroup: IKeyValue) => `admin/user_groups/${securityGroup.value}`,
      ),
    };

    delete payload.organization;
    data.password === "" && delete payload.password;

    createOrEditUser.mutate({ payload, id: user?.id });
    user?.id && queryClient.setQueryData(["users", user.id], data);
  };

  React.useEffect(() => {
    setIsLoading({ userForm: createOrEditUser.isLoading });
  }, [createOrEditUser.isLoading]);

  React.useEffect(() => {
    user && handleSetFormValues(user);
  }, [user]);

  React.useEffect(() => {
    setValue(
      "organization",
      organisationOptions?.find((_organisation) => _organisation.value === user?.organisation.id),
    );
  }, [getOrganization.isSuccess]);

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
                disabled={isLoading.userForm}
              />
            </FormFieldInput>
          </FormField>

          <FormField>
            <FormFieldInput>
              <FormFieldLabel>{t("Email")}</FormFieldLabel>
              <InputText {...{ register, errors }} name="email" disabled={isLoading.userForm} />
            </FormFieldInput>
          </FormField>
        </div>

        <FormField>
          <FormFieldInput>
            <FormFieldLabel>{t("Description")}</FormFieldLabel>
            <Textarea {...{ register, errors }} name="description" disabled={isLoading.userForm} />
          </FormFieldInput>
        </FormField>

        <div className={styles.grid}>
          <FormField>
            <FormFieldInput>
              <FormFieldLabel>{t("Locale")}</FormFieldLabel>
              <InputText {...{ register, errors }} name="locale" disabled={isLoading.userForm} />
            </FormFieldInput>
          </FormField>

          <FormField>
            <FormFieldInput>
              <FormFieldLabel>{t("Person")}</FormFieldLabel>
              <InputText {...{ register, errors }} name="person" disabled={isLoading.userForm} />
            </FormFieldInput>
          </FormField>

          <FormField>
            <FormFieldInput>
              <FormFieldLabel>{t("Organization")}</FormFieldLabel>
              {getOrganization.isSuccess && (
                <SelectSingle
                  options={organisationOptions ?? []}
                  {...{ register, errors, control }}
                  name="organization"
                  validation={enrichValidation({ required: true })}
                  disabled={isLoading.userForm}
                />
              )}
              {getOrganization.isLoading && <Skeleton height={50} />}
            </FormFieldInput>
          </FormField>

          <FormField>
            <FormFieldInput>
              <FormFieldLabel>{t("Applications")}</FormFieldLabel>
              {getApplications.isSuccess && (
                <SelectMultiple
                  options={applicationOptions ?? []}
                  {...{ register, errors, control }}
                  name="applications"
                  validation={enrichValidation({ required: true })}
                  disabled={isLoading.userForm}
                />
              )}
              {getApplications.isLoading && <Skeleton height={50} />}
            </FormFieldInput>
          </FormField>

          <FormField>
            <FormFieldInput>
              <FormFieldLabel>{t("Security Groups")}</FormFieldLabel>
              {getSecurityGroups.isSuccess && (
                <SelectMultiple
                  options={securityGroupOptions ?? []}
                  {...{ register, errors, control }}
                  name="securityGroups"
                  validation={enrichValidation({ required: true })}
                  disabled={isLoading.userForm}
                />
              )}
              {getSecurityGroups.isLoading && <Skeleton height={50} />}
            </FormFieldInput>
          </FormField>
        </div>

        <div className={styles.grid}>
          <FormField>
            <FormFieldInput>
              <FormFieldLabel>{t("Password")}</FormFieldLabel>
              <InputPassword
                {...{ register, errors }}
                name="password"
                validation={enrichValidation({
                  validate: (value) => validatePassword(value, validationPassword, !user),
                })}
                disabled={isLoading.userForm}
              />
            </FormFieldInput>
          </FormField>

          <FormField>
            <FormFieldInput>
              <FormFieldLabel>{t("Retype Password")}</FormFieldLabel>
              <InputPassword
                {...{ register, errors }}
                name="validation_password"
                validation={enrichValidation({ validate: (value) => validatePassword(password, value, !user) })}
                disabled={isLoading.userForm}
              />
            </FormFieldInput>
          </FormField>
        </div>
      </div>
    </form>
  );
};

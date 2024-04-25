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

  const organizationOptions = getOrganization.data?.map((_organization: any) => ({
    label: _organization.name,
    value: _organization.id,
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
    const basicFields: string[] = ["reference", "name", "description", "version", "email", "password", "locale", "person"];
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
      organization: data.organization && `/admin/organizations/${data.organization.value}`,
      applications: data.applications?.map((application: IKeyValue) => `/admin/applications/${application.value}`),
      securityGroups: data.securityGroups?.map(
        (securityGroup: IKeyValue) => `admin/user_groups/${securityGroup.value}`,
      ),
    };

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
      organizationOptions?.find((_organization) => _organization.value === user?.organization.id),
    );
  }, [getOrganization.isSuccess]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} id={formId} className={styles.formContainer}>
      <div className={styles.gridContainer}>
        <div className={styles.grid}>
          <FormField>
            <FormFieldInput>
              <FormFieldLabel>{t("Reference")}</FormFieldLabel>
              <InputText
                {...{ register, errors }}
                name="reference"
                disabled={isLoading.userForm}
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
                disabled={isLoading.userForm}
                defaultValue={user?.version ?? "0.0.0"}
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
                validation={enrichValidation({ required: true })}
                disabled={isLoading.userForm}
                ariaLabel={t("Enter name")}
              />
            </FormFieldInput>
          </FormField>

          <FormField>
            <FormFieldInput>
              <FormFieldLabel>{t("Email")}</FormFieldLabel>
              <InputText
                {...{ register, errors }}
                name="email"
                disabled={isLoading.userForm}
                ariaLabel={t("Enter email")}
              />
            </FormFieldInput>
          </FormField>
        </div>

        <FormField>
          <FormFieldInput>
            <FormFieldLabel>{t("Description")}</FormFieldLabel>
            <Textarea
              {...{ register, errors }}
              name="description"
              disabled={isLoading.userForm}
              ariaLabel={t("Enter description")}
            />
          </FormFieldInput>
        </FormField>

        <div className={styles.grid}>
          <FormField>
            <FormFieldInput>
              <FormFieldLabel>{t("Locale")}</FormFieldLabel>
              <InputText
                {...{ register, errors }}
                name="locale"
                disabled={isLoading.userForm}
                ariaLabel={t("Enter locale")}
              />
            </FormFieldInput>
          </FormField>

          <FormField>
            <FormFieldInput>
              <FormFieldLabel>{t("Person")}</FormFieldLabel>
              <InputText
                {...{ register, errors }}
                name="person"
                disabled={isLoading.userForm}
                ariaLabel={t("Enter person")}
              />
            </FormFieldInput>
          </FormField>

          <FormField>
            <FormFieldInput>
              <FormFieldLabel>{t("Organization")}</FormFieldLabel>
              {getOrganization.isSuccess && (
                <SelectSingle
                  options={organizationOptions ?? []}
                  {...{ register, errors, control }}
                  name="organization"
                  validation={enrichValidation({ required: true })}
                  disabled={isLoading.userForm}
                  ariaLabel={t("Select an organization")}
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
                  ariaLabel={t("Select one or more applications")}
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
                  ariaLabel={t("Select one or more security groups")}
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
                ariaLabel={t("Enter password")}
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
                ariaLabel={t("Retype password")}
              />
            </FormFieldInput>
          </FormField>
        </div>
      </div>
    </form>
  );
};

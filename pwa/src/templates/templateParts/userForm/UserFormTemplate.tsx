import * as React from "react";
import * as styles from "./UserFormTemplate.module.css";
import FormField, { FormFieldInput, FormFieldLabel } from "@gemeente-denhaag/form-field";
import { Alert } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { InputPassword, InputText, SelectSingle, Textarea } from "@conduction/components";
import { useForm } from "react-hook-form";
import { QueryClient, UseQueryResult } from "react-query";
import { useUser } from "../../../hooks/user";
import Skeleton from "react-loading-skeleton";
import { SaveButtonTemplate, TAfterSuccessfulFormSubmit } from "../saveButton/SaveButtonTemplate";
import { navigate } from "gatsby";

interface UserFormTemplateProps {
  user?: any;
  getOrganization: UseQueryResult<any[], Error>;
}

export const UserFormTemplate: React.FC<UserFormTemplateProps> = ({ user, getOrganization }) => {
  const { t } = useTranslation();
  const [formError, setFormError] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);

  const [afterSuccessfulFormSubmit, setAfterSuccessfulFormSubmit] = React.useState<TAfterSuccessfulFormSubmit>("save");

  const queryClient = new QueryClient();
  const _useUsers = useUser(queryClient);
  const createOrEditUser = _useUsers.createOrEdit(user?.id);

  const organisationOptions = getOrganization.data?.map((_organisation: any) => ({
    label: _organisation.name,
    value: _organisation.id,
  }));

  React.useEffect(() => {
    setValue(
      "organization",
      organisationOptions?.find((_organisation) => _organisation.value === user?.organisation.id),
    );
  }, [getOrganization.isSuccess]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    control,
    watch,
    reset,
  } = useForm();

  const pwd = watch("password");
  const pwd_verify = watch("password_verify");

  const handleSetFormValues = (user: any): void => {
    const basicFields: string[] = ["name", "description", "email", "password", "locale", "person"];
    basicFields.forEach((field) => setValue(field, user[field]));
  };

  React.useEffect(() => {
    user && handleSetFormValues(user);
  }, [user]);

  const onSubmit = (data: any): void => {
    const payload = {
      ...data,
      organisation: data.organization && `/admin/organisations/${data.organization.value}`,
    };

    delete payload.organization;

    user?.id && queryClient.setQueryData(["users", user.id], data);

    createOrEditUser.mutate(
      { payload, id: user?.id },
      {
        onSuccess: (newUser) => {
          switch (afterSuccessfulFormSubmit) {
            case "save":
              !user && navigate(`/settings/users/${newUser.id}`);
              break;

            case "saveAndClose":
              navigate("/settings");
              break;

            case "saveAndCreateNew":
              user && navigate("/settings/users/new");
              !user && reset();
              break;
          }
        },
      },
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <SaveButtonTemplate {...{ setAfterSuccessfulFormSubmit }} />

      <div className={styles.gridContainer}>
        <div className={styles.grid}>
          <FormField>
            <FormFieldInput>
              <FormFieldLabel>{t("Name")}</FormFieldLabel>
              <InputText {...{ register, errors }} name="name" validation={{ required: true }} disabled={loading} />
            </FormFieldInput>
          </FormField>

          <FormField>
            <FormFieldInput>
              <FormFieldLabel>{t("Description")}</FormFieldLabel>
              <Textarea {...{ register, errors }} name="description" disabled={loading} />
            </FormFieldInput>
          </FormField>

          <FormField>
            <FormFieldInput>
              <FormFieldLabel>{t("Email")}</FormFieldLabel>
              <InputText {...{ register, errors }} name="email" disabled={loading} />
            </FormFieldInput>
          </FormField>

          <FormField>
            <FormFieldInput>
              <FormFieldLabel>{t("Locale")}</FormFieldLabel>
              <InputText {...{ register, errors }} name="locale" disabled={loading} />
            </FormFieldInput>
          </FormField>

          <FormField>
            <FormFieldInput>
              <FormFieldLabel>{t("Person")}</FormFieldLabel>
              <InputText {...{ register, errors }} name="person" disabled={loading} />
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
                  disabled={loading}
                  validation={{ required: true }}
                />
              )}
              {getOrganization.isLoading && <Skeleton height={50} />}
            </FormFieldInput>
          </FormField>

          <FormField>
            <FormFieldInput>
              <FormFieldLabel>{t("Password")}</FormFieldLabel>
              <InputPassword
                {...{ register, errors }}
                name="password"
                disabled={loading}
                validation={{ validate: (value) => value === pwd_verify }}
              />
            </FormFieldInput>
          </FormField>

          <FormField>
            <FormFieldInput>
              <FormFieldLabel>{t("Retype Password")}</FormFieldLabel>
              <InputPassword
                {...{ register, errors }}
                name="password_verify"
                disabled={loading}
                validation={{ validate: (value) => value === pwd }}
              />
            </FormFieldInput>
          </FormField>
        </div>
      </div>
    </form>
  );
};

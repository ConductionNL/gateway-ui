import * as React from "react";
import * as styles from "./UserFormTemplate.module.css";
import FormField, { FormFieldInput, FormFieldLabel } from "@gemeente-denhaag/form-field";
import { useTranslation } from "react-i18next";
import { InputPassword, InputText, SelectSingle, Textarea } from "@conduction/components";
import { useForm } from "react-hook-form";
import { QueryClient } from "react-query";
import { useUser } from "../../../hooks/user";
import Skeleton from "react-loading-skeleton";
import { validatePassword } from "../../../services/stringValidations";
import { ErrorMessage } from "../../../components/errorMessage/ErrorMessage";
import { useOrganization } from "../../../hooks/organization";
import { IsLoadingContext } from "../../../context/isLoading";

interface UserFormTemplateProps {
  user?: any;
}

export const formId: string = "user-form";

export const UserFormTemplate: React.FC<UserFormTemplateProps> = ({ user }) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = React.useContext(IsLoadingContext);

  const queryClient = new QueryClient();
  const _useUsers = useUser(queryClient);
  const createOrEditUser = _useUsers.createOrEdit(user?.id);

  const _useOrganizations = useOrganization(queryClient);
  const getOrganization = _useOrganizations.getAll();

  const organisationOptions = getOrganization.data?.map((_organisation: any) => ({
    label: _organisation.name,
    value: _organisation.id,
  }));

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    control,
    watch,
  } = useForm();

  const pwd = watch("password");
  const pwd_verify = watch("password_verify");

  const handleSetFormValues = (user: any): void => {
    const basicFields: string[] = ["name", "description", "email", "password", "locale", "person"];
    basicFields.forEach((field) => setValue(field, user[field]));
  };

  const onSubmit = (data: any): void => {
    const payload = {
      ...data,
      organisation: data.organization && `/admin/organisations/${data.organization.value}`,
    };

    delete payload.organization;
    data.password === "" && delete payload.password;

    createOrEditUser.mutate({ payload, id: user?.id });
    user?.id && queryClient.setQueryData(["users", user.id], data);
  };

  React.useEffect(() => {
    setIsLoading({ ...isLoading, userForm: createOrEditUser.isLoading });
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
                validation={{ required: true }}
                disabled={isLoading.userForm}
              />
            </FormFieldInput>
          </FormField>

          <FormField>
            <FormFieldInput>
              <FormFieldLabel>{t("Description")}</FormFieldLabel>
              <Textarea {...{ register, errors }} name="description" disabled={isLoading.userForm} />
            </FormFieldInput>
          </FormField>

          <FormField>
            <FormFieldInput>
              <FormFieldLabel>{t("Email")}</FormFieldLabel>
              <InputText {...{ register, errors }} name="email" disabled={isLoading.userForm} />
            </FormFieldInput>
          </FormField>

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
                  validation={{ required: true }}
                  disabled={isLoading.userForm}
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
                validation={{ validate: () => validatePassword(pwd, pwd_verify) }}
                disabled={isLoading.userForm}
              />

              {errors["password"] && <ErrorMessage message={errors["password"].message} />}
            </FormFieldInput>
          </FormField>

          <FormField>
            <FormFieldInput>
              <FormFieldLabel>{t("Retype Password")}</FormFieldLabel>
              <InputPassword
                {...{ register, errors }}
                name="password_verify"
                validation={{ validate: () => validatePassword(pwd_verify, pwd) }}
                disabled={isLoading.userForm}
              />

              {errors["password_verify"] && <ErrorMessage message={errors["password_verify"].message} />}
            </FormFieldInput>
          </FormField>
        </div>
      </div>
    </form>
  );
};

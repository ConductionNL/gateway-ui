import * as React from "react";
import * as styles from "./UserFormTemplate.module.css";
import FormField, { FormFieldInput, FormFieldLabel } from "@gemeente-denhaag/form-field";
import { Alert, Button, Heading1 } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { InputPassword, InputText, SelectMultiple, SelectSingle, Textarea } from "@conduction/components";
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk, faMinus, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { QueryClient, UseQueryResult } from "react-query";
import clsx from "clsx";
import { useDashboardCard } from "../../../hooks/useDashboardCard";
import { useUser } from "../../../hooks/user";
import Skeleton from "react-loading-skeleton";

interface UserFormTemplateProps {
  user?: any;
  getOrganization: UseQueryResult<any[], Error>;
}

export const UserFormTemplate: React.FC<UserFormTemplateProps> = ({ user, getOrganization }) => {
  const { t } = useTranslation();
  const { addOrRemoveDashboardCard, getDashboardCard } = useDashboardCard();
  const [formError, setFormError] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);

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

  const dashboardCard = getDashboardCard(user?.id);

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

  const addOrRemoveFromDashboard = () => {
    addOrRemoveDashboardCard(user.name, "User", "User", user.id, dashboardCard?.id);
  };

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
      organisation: {
        ...user?.organisation,
        id: data.organization.value,
      },
    };

    delete payload.organization;

    createOrEditUser.mutate({ payload, id: user?.id });
    user?.id && queryClient.setQueryData(["users", user.id], data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <section className={styles.section}>
        <Heading1>{user?.id ? `Edit ${user.name}` : "Create User"}</Heading1>

        <div className={styles.buttons}>
          <Button className={styles.buttonIcon} type="submit" disabled={loading}>
            <FontAwesomeIcon icon={faFloppyDisk} />
            {t("Save")}
          </Button>

          {user?.id && (
            <>
              <Button className={styles.buttonIcon} onClick={addOrRemoveFromDashboard}>
                <FontAwesomeIcon icon={dashboardCard ? faMinus : faPlus} />
                {dashboardCard ? t("Remove from dashboard") : t("Add to dashboard")}
              </Button>

              {/* <Button className={clsx(styles.buttonIcon, styles.deleteButton)} onClick={handleDelete}>
                  <FontAwesomeIcon icon={faTrash} />
                  {t("Delete")}
                </Button> */}
            </>
          )}
        </div>
      </section>

      {formError && <Alert text={formError} title={t("Oops, something went wrong")} variant="error" />}
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
                  // @ts-ignore
                  options={organisationOptions}
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
                // @ts-ignore
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
                // @ts-ignore
                validation={{ validate: (value) => value === pwd }}
              />
            </FormFieldInput>
          </FormField>
        </div>
      </div>
    </form>
  );
};

import * as React from "react";
import * as styles from "./UserFormTemplate.module.css";
import FormField, { FormFieldInput, FormFieldLabel } from "@gemeente-denhaag/form-field";
import { Alert, Button, Heading1 } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { InputText, Textarea } from "@conduction/components";
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk, faMinus, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { QueryClient } from "react-query";
import clsx from "clsx";
import { useDashboardCard } from "../../../hooks/useDashboardCard";
import { useUser } from "../../../hooks/user";

interface UserFormTemplateProps {
  user?: any;
}

export const UserFormTemplate: React.FC<UserFormTemplateProps> = ({ user }) => {
  const { t } = useTranslation();
  const { addOrRemoveDashboardCard, getDashboardCard } = useDashboardCard();
  const [formError, setFormError] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);

  const queryClient = new QueryClient();
  const _useUsers = useUser(queryClient);
  const createOrEditUser = _useUsers.createOrEdit(user?.id);

  const dashboardCard = getDashboardCard(user?.id);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const addOrRemoveFromDashboard = () => {
    addOrRemoveDashboardCard(user.name, "User", "User", user.id, dashboardCard?.id);
  };

  const handleSetFormValues = (organization: any): void => {
    const basicFields: string[] = ["name", "description", "email", "password", "locale", "person"];
    basicFields.forEach((field) => setValue(field, organization[field]));
  };

  React.useEffect(() => {
    user && handleSetFormValues(user);
  }, [user]);

  const onSubmit = (data: any): void => {
    createOrEditUser.mutate({ payload: data, id: user?.id });

    user?.id && queryClient.setQueryData(["users", user.id], data);
  };

  return (
    <>
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
                <FormFieldLabel>{t("Password")}</FormFieldLabel>
                <InputText {...{ register, errors }} name="password" disabled={loading} />
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
          </div>
        </div>
      </form>
    </>
  );
};

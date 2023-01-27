import * as React from "react";
import * as styles from "./OrganizationFormTemplate.module.css";
import FormField, { FormFieldInput, FormFieldLabel } from "@gemeente-denhaag/form-field";
import { Button, Heading1 } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { InputText, Textarea } from "@conduction/components";
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk, faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { QueryClient } from "react-query";
import { useOrganization } from "../../../hooks/organization";
import { useDashboardCard } from "../../../hooks/useDashboardCard";
import clsx from "clsx";

interface OrganizationFormProps {
  organization?: any;
}

export const OrganizationForm: React.FC<OrganizationFormProps> = ({ organization }) => {
  const { t } = useTranslation();
  const { toggleDashboardCard, getDashboardCard, loading: dashboardLoading } = useDashboardCard();
  const [loading, setLoading] = React.useState<boolean>(false);

  const queryClient = new QueryClient();
  const _useOrganizations = useOrganization(queryClient);
  const createOrEditOrganization = _useOrganizations.createOrEdit(organization?.id);

  const dashboardCard = getDashboardCard(organization?.id);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const toggleFromDashboard = () => {
    toggleDashboardCard(organization.name, "organization", "Organization", organization.id, dashboardCard?.id);
  };

  const handleSetFormValues = (organization: any): void => {
    const basicFields: string[] = ["name", "description"];
    basicFields.forEach((field) => setValue(field, organization[field]));
  };

  React.useEffect(() => {
    setLoading(createOrEditOrganization.isLoading || dashboardLoading);
  }, [createOrEditOrganization.isLoading, dashboardLoading]);

  React.useEffect(() => {
    organization && handleSetFormValues(organization);
  }, [organization]);

  const onSubmit = (data: any): void => {
    createOrEditOrganization.mutate({ payload: data, id: organization?.id });

    organization?.id && queryClient.setQueryData(["organizations", organization.id], data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <section className={styles.section}>
        <Heading1>{organization?.id ? `Edit ${organization.name}` : "Create Organization"}</Heading1>

        <div className={styles.buttons}>
          <Button className={clsx(styles.buttonIcon, styles.button)} type="submit" disabled={loading}>
            <FontAwesomeIcon icon={faFloppyDisk} />
            {t("Save")}
          </Button>

          {organization?.id && (
            <Button
              className={clsx(styles.buttonIcon, styles.button)}
              onClick={toggleFromDashboard}
              disabled={loading}
            >
              <FontAwesomeIcon icon={dashboardCard ? faMinus : faPlus} />
              {dashboardCard ? t("Remove from dashboard") : t("Add to dashboard")}
            </Button>
          )}
        </div>
      </section>

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
              <Textarea
                {...{ register, errors }}
                name="description"
                validation={{ required: true }}
                disabled={loading}
              />
            </FormFieldInput>
          </FormField>
        </div>
      </div>
    </form>
  );
};

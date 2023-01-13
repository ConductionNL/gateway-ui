import * as React from "react";
import * as styles from "./SecurityGroupFormTemplate.module.css";
import FormField, { FormFieldInput, FormFieldLabel } from "@gemeente-denhaag/form-field";
import { Alert, Button, Heading1 } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { InputText, Textarea } from "@conduction/components";
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import { QueryClient } from "react-query";
import { useOrganization } from "../../../hooks/organization";

interface OrganizationFormProps {
  loading: any;
  organization?: any;
}

export const OrganizationForm: React.FC<OrganizationFormProps> = ({ loading, organization }) => {
  const { t } = useTranslation();
  const [formError, setFormError] = React.useState<string>("");

  const queryClient = new QueryClient();
  const _useOrganizations = useOrganization(queryClient);
  const createOrEditOrganization = _useOrganizations.createOrEdit(organization.id);

  const {
    register,
    handleSubmit,
	setValue,
    formState: { errors },
  } = useForm();

  const handleSetFormValues = (organization: any): void => {
    const basicFields: string[] = ["firstName", "lastName"];
    basicFields.forEach((field) => setValue(field, organization[field]));
  };

  React.useEffect(() => {
    organization && handleSetFormValues(organization);
  }, [organization]);

  const onSubmit = (data: any): void => {
    createOrEditOrganization.mutate({ payload: data, id: organization.id });

    organization.id && queryClient.setQueryData(["organizations", organization.id], data);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <section className={styles.section}>
          <Heading1>{t("Create Organization")}</Heading1>

          <div className={styles.buttons}>
            <Button className={styles.buttonIcon} type="submit" disabled={loading}>
              <FontAwesomeIcon icon={faFloppyDisk} />
              {t("Save")}
            </Button>
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
                <FormFieldLabel>{t("Config")}</FormFieldLabel>
                <InputText {...{ register, errors }} name="config" validation={{ required: true }} disabled={loading} />
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
    </>
  );
};

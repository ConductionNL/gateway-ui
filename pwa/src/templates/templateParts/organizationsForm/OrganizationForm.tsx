import * as React from "react";
import * as styles from "./OrganizationFormTemplate.module.css";
import FormField, { FormFieldInput, FormFieldLabel } from "@gemeente-denhaag/form-field";
import { useTranslation } from "react-i18next";
import { InputText, Textarea } from "@conduction/components";
import { useForm } from "react-hook-form";
import { QueryClient } from "react-query";
import { useOrganization } from "../../../hooks/organization";

interface OrganizationFormProps {
  organization?: any;
}

export const OrganizationForm: React.FC<OrganizationFormProps> = ({ organization }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = React.useState<boolean>(false);

  const queryClient = new QueryClient();
  const _useOrganizations = useOrganization(queryClient);
  const createOrEditOrganization = _useOrganizations.createOrEdit(organization?.id);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const handleSetFormValues = (organization: any): void => {
    const basicFields: string[] = ["name", "description"];
    basicFields.forEach((field) => setValue(field, organization[field]));
  };

  React.useEffect(() => {
    organization && handleSetFormValues(organization);
  }, [organization]);

  const onSubmit = (data: any): void => {
    createOrEditOrganization.mutate({ payload: data, id: organization?.id });

    organization?.id && queryClient.setQueryData(["organizations", organization.id], data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.formContainer}>
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

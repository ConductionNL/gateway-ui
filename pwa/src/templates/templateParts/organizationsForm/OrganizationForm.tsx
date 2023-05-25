import * as React from "react";
import * as styles from "./OrganizationFormTemplate.module.css";
import FormField, { FormFieldInput, FormFieldLabel } from "@gemeente-denhaag/form-field";
import { useTranslation } from "react-i18next";
import { InputText, Textarea } from "@conduction/components";
import { useForm } from "react-hook-form";
import { useQueryClient } from "react-query";
import { useOrganization } from "../../../hooks/organization";
import { useIsLoadingContext } from "../../../context/isLoading";
import { enrichValidation } from "../../../services/enrichReactHookFormValidation";

interface OrganizationFormProps {
  organization?: any;
}

export const formId: string = "organization-form";

export const OrganizationForm: React.FC<OrganizationFormProps> = ({ organization }) => {
  const { t } = useTranslation();
  const { setIsLoading, isLoading } = useIsLoadingContext();

  const queryClient = useQueryClient();
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
    setIsLoading({ organizationForm: createOrEditOrganization.isLoading });
  }, [createOrEditOrganization.isLoading]);

  React.useEffect(() => {
    organization && handleSetFormValues(organization);
  }, [organization]);

  const onSubmit = (data: any): void => {
    createOrEditOrganization.mutate({ payload: data, id: organization?.id });

    organization?.id && queryClient.setQueryData(["organizations", organization.id], data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.formContainer} id={formId}>
      <div className={styles.gridContainer}>
        <div className={styles.grid}>
          <FormField>
            <FormFieldInput>
              <FormFieldLabel>{t("Name")}</FormFieldLabel>
              <InputText
                {...{ register, errors }}
                name="name"
                validation={enrichValidation({ required: true })}
                disabled={isLoading.organizationForm}
              />
            </FormFieldInput>
          </FormField>

          <FormField>
            <FormFieldInput>
              <FormFieldLabel>{t("Description")}</FormFieldLabel>
              <Textarea
                {...{ register, errors }}
                name="description"
                validation={enrichValidation({ required: true })}
                disabled={isLoading.organizationForm}
              />
            </FormFieldInput>
          </FormField>
        </div>
      </div>
    </form>
  );
};

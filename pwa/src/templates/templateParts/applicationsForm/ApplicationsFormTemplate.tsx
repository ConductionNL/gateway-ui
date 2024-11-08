import * as React from "react";
import * as styles from "./ApplicationsFormTemplate.module.css";
import { useForm } from "react-hook-form";
import FormField, { FormFieldInput, FormFieldLabel } from "@gemeente-denhaag/form-field";
import { useTranslation } from "react-i18next";
import { InputText, Textarea } from "@conduction/components";
import { useQueryClient } from "react-query";
import { useApplication } from "../../../hooks/application";
import Skeleton from "react-loading-skeleton";
import { SelectCreate, SelectSingle } from "@conduction/components/lib/components/formFields/select/select";
import { InputURL } from "@conduction/components/lib/components/formFields";
import { useOrganization } from "../../../hooks/organization";
import { useIsLoadingContext } from "../../../context/isLoading";
import { enrichValidation } from "../../../services/enrichReactHookFormValidation";

interface ApplicationFormTemplateProps {
  application?: any;
}

export const formId: string = "application-form";

export const ApplicationsFormTemplate: React.FC<ApplicationFormTemplateProps> = ({ application }) => {
  const { t } = useTranslation();
  const { setIsLoading, isLoading } = useIsLoadingContext();
  const [domains, setDomains] = React.useState<any[]>([]);

  const queryClient = useQueryClient();
  const _useApplication = useApplication(queryClient);
  const createOrEditApplication = _useApplication.createOrEdit(application?.id);

  const _useOrganization = useOrganization(queryClient);
  const getOrganizations = _useOrganization.getAll();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm();

  const onSubmit = (data: any): void => {
    const payload = {
      ...data,
      domains: data.domains?.map((domain: any) => domain.value),
      organization: data.organization && `/admin/organizations/${data.organization.value}`,
    };

    createOrEditApplication.mutate({ payload: payload, id: application?.id });
    application && queryClient.setQueryData(["entities", application.id], data);
  };

  const handleSetFormValues = (application: any): void => {
    const basicFields: string[] = [
      "reference",
      "name",
      "description",
      "version",
      "public",
      "secret",
      "publicKey",
      "privateKey",
      "resource",
      "organization",
      "ednpoints",
    ];
    basicFields.forEach((field) => setValue(field, application[field]));

    setValue(
      "domains",
      application["domains"].map((domain: any) => ({ label: domain, value: domain })),
    );

    setValue("organization", { label: application?.organization.name, value: application?.organization.id });
  };

  React.useEffect(() => {
    application && handleSetFormValues(application);
    application && setDomains(application.domains);
  }, [application]);

  React.useEffect(() => {
    setIsLoading({ applicationForm: createOrEditApplication.isLoading });
  }, [createOrEditApplication.isLoading]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} id={formId} className={styles.form}>
      <div className={styles.gridContainer}>
        <div className={styles.grid}>
          <FormField>
            <FormFieldInput>
              <FormFieldLabel>{t("Reference")}</FormFieldLabel>
              <InputText
                {...{ register, errors }}
                name="reference"
                validation={enrichValidation({ required: true })}
                disabled={isLoading.applicationForm}
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
                disabled={isLoading.applicationForm}
                defaultValue={application?.version ?? "0.0.0"}
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
                validation={enrichValidation({ required: true, maxLength: 225 })}
                disabled={isLoading.applicationForm}
                ariaLabel={t("Enter name")}
              />
            </FormFieldInput>
          </FormField>

          <FormField>
            <FormFieldInput>
              <FormFieldLabel>{t("Description")}</FormFieldLabel>
              <Textarea
                {...{ register, errors }}
                name="description"
                disabled={isLoading.applicationForm}
                ariaLabel={t("Enter description")}
              />
            </FormFieldInput>
          </FormField>
          <FormField>
            <FormFieldInput>
              <FormFieldLabel>{t("Domains")}</FormFieldLabel>
              {domains.length < 0 && <Skeleton height="50px" />}
              {domains.length >= 0 && (
                <SelectCreate
                  options={domains.map((domain: any) => ({
                    label: domain,
                    value: domain,
                  }))}
                  disabled={isLoading.applicationForm}
                  name="domains"
                  {...{ register, errors, control }}
                  ariaLabel={t("Select or create a domain")}
                />
              )}
            </FormFieldInput>
          </FormField>
          <FormField>
            <FormFieldInput>
              <FormFieldLabel>{t("Public")}</FormFieldLabel>
              <Textarea
                {...{ register, errors }}
                name="public"
                disabled={isLoading.applicationForm}
                ariaLabel={t("Enter public")}
              />
            </FormFieldInput>
          </FormField>

          <FormField>
            <FormFieldInput>
              <FormFieldLabel>{t("Secret")}</FormFieldLabel>
              <Textarea
                {...{ register, errors }}
                name="secret"
                disabled={isLoading.applicationForm}
                ariaLabel={t("Enter secret")}
              />
            </FormFieldInput>
          </FormField>

          <FormField>
            <FormFieldInput>
              <FormFieldLabel>{t("publicKey (write only)")}</FormFieldLabel>
              <Textarea
                {...{ register, errors }}
                name="publicKey"
                disabled={isLoading.applicationForm}
                ariaLabel={t("Enter publicKey")}
              />
            </FormFieldInput>
          </FormField>

          <FormField>
            <FormFieldInput>
              <FormFieldLabel>{t("privateKey (write only)")}</FormFieldLabel>
              <Textarea
                {...{ register, errors }}
                name="privateKey"
                disabled={isLoading.applicationForm}
                ariaLabel={t("Enter privateKey")}
              />
            </FormFieldInput>
          </FormField>

          <FormField>
            <FormFieldInput>
              <FormFieldLabel>{t("Resource")}</FormFieldLabel>
              <InputURL
                {...{ register, errors }}
                name="resource"
                disabled={isLoading.applicationForm}
                ariaLabel={t("Enter resource")}
              />
            </FormFieldInput>
          </FormField>

          <FormField>
            <FormFieldInput>
              <FormFieldLabel>{t("Organization")}</FormFieldLabel>

              {getOrganizations.isLoading && <Skeleton height="50px" />}
              {getOrganizations.isSuccess && (
                <SelectSingle
                  options={getOrganizations.data.map((organization: any) => ({
                    label: organization.name,
                    value: organization.id,
                  }))}
                  name="organization"
                  {...{ register, errors, control }}
                  disabled={isLoading.applicationForm}
                  validation={enrichValidation({ required: true })}
                  ariaLabel={t("Select an organization")}
                />
              )}
            </FormFieldInput>
          </FormField>
        </div>
      </div>
    </form>
  );
};

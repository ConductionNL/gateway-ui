import * as React from "react";
import * as styles from "./ApplicationsFormTemplate.module.css";
import { useForm } from "react-hook-form";
import FormField, { FormFieldInput, FormFieldLabel } from "@gemeente-denhaag/form-field";
import { useTranslation } from "react-i18next";
import { InputText, Textarea } from "@conduction/components";
import { useQueryClient } from "react-query";
import { ErrorMessage } from "../../../components/errorMessage/ErrorMessage";
import { useApplication } from "../../../hooks/application";
import Skeleton from "react-loading-skeleton";
import { SelectCreate, SelectSingle } from "@conduction/components/lib/components/formFields/select/select";
import { InputURL } from "@conduction/components/lib/components/formFields";
import { useOrganization } from "../../../hooks/organization";

interface ApplicationFormTemplateProps {
  application?: any;
  getSave: Function;
}

export const ApplicationsFormTemplate: React.FC<ApplicationFormTemplateProps> = ({ application, getSave }) => {
  const { t } = useTranslation();

  const [loading, setLoading] = React.useState<boolean>(false);
  const [domains, setDomains] = React.useState<any[]>([]);

  const queryClient = useQueryClient();
  const _useApplication = useApplication(queryClient);
  const createOrEditApplication = _useApplication.createOrEdit(application?.id);
  const deleteApplication = _useApplication.remove();

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
      organization: data.organization && `/admin/organisations/${data.organization.value}`,
    };

    createOrEditApplication.mutate({ payload: payload, id: application?.id });
    application && queryClient.setQueryData(["entities", application.id], data);
  };

  getSave(handleSubmit(onSubmit));

  const handleSetFormValues = (application: any): void => {
    const basicFields: string[] = [
      "name",
      "description",
      "public",
      "secret",
      "publicKey",
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
    if (createOrEditApplication.isLoading || deleteApplication.isLoading) {
      setLoading(true);
      return;
    }

    setLoading(false);
  }, [createOrEditApplication.isLoading, deleteApplication.isLoading]);

  return (
    <div className={styles.container}>
      <form>
        <div className={styles.gridContainer}>
          <div className={styles.grid}>
            <FormField>
              <FormFieldInput>
                <FormFieldLabel>{t("Name")}</FormFieldLabel>
                <InputText
                  {...{ register, errors }}
                  name="name"
                  validation={{ required: true, maxLength: 225 }}
                  disabled={loading}
                />
                {errors["name"] && <ErrorMessage message={errors["name"].message} />}
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
                <FormFieldLabel>{t("Domains")}</FormFieldLabel>
                {domains.length < 0 && <Skeleton height="50px" />}
                {domains.length >= 0 && (
                  // @ts-ignore
                  <SelectCreate
                    options={domains.map((domain: any) => ({
                      label: domain,
                      value: domain,
                    }))}
                    disabled={loading}
                    name="domains"
                    {...{ register, errors, control }}
                  />
                )}
              </FormFieldInput>
            </FormField>
            <FormField>
              <FormFieldInput>
                <FormFieldLabel>{t("Public")}</FormFieldLabel>
                <Textarea {...{ register, errors }} name="public" disabled={loading} />
              </FormFieldInput>
            </FormField>

            <FormField>
              <FormFieldInput>
                <FormFieldLabel>{t("Secret")}</FormFieldLabel>
                <Textarea {...{ register, errors }} name="secret" disabled={loading} />
              </FormFieldInput>
            </FormField>

            <FormField>
              <FormFieldInput>
                <FormFieldLabel>{t("publicKey")}</FormFieldLabel>
                <Textarea {...{ register, errors }} name="publicKey" disabled={loading} />
              </FormFieldInput>
            </FormField>

            <FormField>
              <FormFieldInput>
                <FormFieldLabel>{t("Resource")}</FormFieldLabel>
                <InputURL {...{ register, errors }} name="resource" disabled={loading} />
              </FormFieldInput>
            </FormField>

            <FormField>
              <FormFieldInput>
                <FormFieldLabel>{t("Organization")}</FormFieldLabel>

                {getOrganizations.isLoading && <Skeleton height="50px" />}
                {getOrganizations.isSuccess && (
                  // @ts-ignore
                  <SelectSingle
                    options={getOrganizations.data.map((organization: any) => ({
                      label: organization.name,
                      value: organization.id,
                    }))}
                    name="organization"
                    {...{ register, errors, control }}
                    disabled={loading}
                    validation={{ required: true }}
                  />
                )}
              </FormFieldInput>
            </FormField>
          </div>
        </div>
      </form>
    </div>
  );
};
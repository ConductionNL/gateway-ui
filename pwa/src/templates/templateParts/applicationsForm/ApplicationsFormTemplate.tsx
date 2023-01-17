import * as React from "react";
import * as styles from "./ApplicationsFormTemplate.module.css";
import { useForm } from "react-hook-form";
import FormField, { FormFieldInput, FormFieldLabel } from "@gemeente-denhaag/form-field";
import { Button } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { InputText, Textarea } from "@conduction/components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import { useQueryClient } from "react-query";
import { useDashboardCard } from "../../../hooks/useDashboardCard";
import { ErrorMessage } from "../../../components/errorMessage/ErrorMessage";
import { useApplication } from "../../../hooks/application";
import Skeleton from "react-loading-skeleton";
import { SelectCreate } from "@conduction/components/lib/components/formFields/select/select";
import { InputURL } from "@conduction/components/lib/components/formFields";

interface ApplicationFormTemplateProps {
  application?: any;
}

export const ApplicationsFormTemplate: React.FC<ApplicationFormTemplateProps> = ({ application }) => {
  const { t } = useTranslation();

  const [loading, setLoading] = React.useState<boolean>(false);
  const [domains, setDomains] = React.useState<any[]>([]);

  const queryClient = useQueryClient();
  const _useApplication = useApplication(queryClient);
  const createOrEditApplication = _useApplication.createOrEdit(application?.id);
  const deleteApplication = _useApplication.remove();

  const functionSelectOptions = [
    { label: "No Function", value: "noFunction" },
    { label: "Organization", value: "organization" },
    { label: "Person", value: "person" },
    { label: "User", value: "user" },
    { label: "User Group", value: "userGroup" },
    { label: "Processing Log", value: "processingLog" },
  ];

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm();

  const onSubmit = (data: any): void => {
    data = { ...data, function: data.function.value };

    createOrEditApplication.mutate({ payload: data, id: application.id });
    application && queryClient.setQueryData(["entities", application.id], data);
  };

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
      "function",
      functionSelectOptions.find((option) => application.function === option.value),
    );

    setValue(
      "domains",
      application["domains"].map((domain: any) => ({ label: domain, value: domain })),
    );
  };

  React.useEffect(() => {
    application && handleSetFormValues(application);
    setDomains(application?.domains);
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
      <form onSubmit={handleSubmit(onSubmit)}>
        <section className={styles.section}>
          <div className={styles.buttons}>
            <Button className={styles.buttonIcon} type="submit" disabled={loading}>
              <FontAwesomeIcon icon={faFloppyDisk} />
              {t("Save")}
            </Button>
          </div>
        </section>

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
                {domains.length <= 0 && <Skeleton height="50px" />}
                {domains.length > 0 && (
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
          </div>
        </div>
      </form>
    </div>
  );
};

import * as React from "react";
import * as styles from "./AuthenticationFormTemplate.module.css";
import FormField, { FormFieldInput, FormFieldLabel } from "@gemeente-denhaag/form-field";
import { Alert } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { InputText, Textarea } from "@conduction/components";
import { useForm } from "react-hook-form";
import { QueryClient } from "react-query";

interface AuthenticationFormTemplateProps {
  authentication?: any;
}

export const AuthenticationFormTemplate: React.FC<AuthenticationFormTemplateProps> = ({ authentication }) => {
  // NOTE: taken from organization

  const { t } = useTranslation();
  const [formError, setFormError] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);

  const queryClient = new QueryClient();
  const _useAuthentications = useAuthentication(queryClient);
  const createOrEditAuthentication = _useAuthentications.createOrEdit(authentication?.id);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const handleSetFormValues = (authentication: any): void => {
    const basicFields: string[] = ["name", "description"];
    basicFields.forEach((field) => setValue(field, authentication[field]));
  };

  React.useEffect(() => {
    authentication && handleSetFormValues(authentication);
  }, [authentication]);

  const onSubmit = (data: any): void => {
    createOrEditAuthentication.mutate({ payload: data, id: authentication?.id });

    authentication?.id && queryClient.setQueryData(["organizations", authentication.id], data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} id="AuthForm">
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

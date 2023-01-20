import * as React from "react";
import * as styles from "./AuthenticationFormTemplate.module.css";
import FormField, { FormFieldInput, FormFieldLabel } from "@gemeente-denhaag/form-field";
import { useTranslation } from "react-i18next";
import { InputText, Textarea } from "@conduction/components";
import { useForm } from "react-hook-form";
import { QueryClient } from "react-query";
import { useAuthentication } from "../../../hooks/authentication";
import { InputURL } from "@conduction/components/lib/components/formFields";
import { SelectCreate } from "@conduction/components/lib/components/formFields/select/select";
import Skeleton from "react-loading-skeleton";

interface AuthenticationFormTemplateProps {
  authentication?: any;
}

export const AuthenticationFormTemplate: React.FC<AuthenticationFormTemplateProps> = ({ authentication }) => {
  // NOTE: taken from organization

  const { t } = useTranslation();
  const [scopes, setScopes] = React.useState<any[]>([]);

  const queryClient = new QueryClient();
  const _useAuthentications = useAuthentication(queryClient);
  const createOrEditAuthentication = _useAuthentications.createOrEdit(authentication?.id);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm();

  const handleSetFormValues = (authentication: any): void => {
    const basicFields: string[] = ["name", "authenticateUrl", "tokenUrl", "secret", "clientId"];
    basicFields.forEach((field) => setValue(field, authentication[field]));

    setValue(
      "scopes",
      authentication["scopes"].map((scope: any) => ({ label: scope, value: scope })),
    );
  };

  React.useEffect(() => {
    authentication && handleSetFormValues(authentication);
    authentication && setScopes(authentication.scopes);
  }, [authentication]);

  const onSubmit = (data: any): void => {
    const payload = {
      ...data,
      scopes: data.scopes?.map((scope: any) => scope.value),
    };

    createOrEditAuthentication.mutate({ payload: payload, id: authentication?.id });

    authentication?.id && queryClient.setQueryData(["organizations", authentication.id], data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} id="AuthForm">
      <div className={styles.gridContainer}>
        <div className={styles.grid}>
          <FormField>
            <FormFieldInput>
              <FormFieldLabel>{t("Name")}</FormFieldLabel>
              <InputText {...{ register, errors }} name="name" validation={{ required: true }} />
            </FormFieldInput>
          </FormField>

          <FormField>
            <FormFieldInput>
              <FormFieldLabel>{t("Authenticate Url")}</FormFieldLabel>
              <InputURL name="authenticateUrl" {...{ register, errors }} />
            </FormFieldInput>
          </FormField>

          <FormField>
            <FormFieldInput>
              <FormFieldLabel>{t("Token Url")}</FormFieldLabel>
              <InputURL name="tokenUrl" {...{ register, errors }} />
            </FormFieldInput>
          </FormField>

          <FormField>
            <FormFieldInput>
              <FormFieldLabel>{t("Secret")}</FormFieldLabel>
              <Textarea {...{ register, errors }} name="secret" />
            </FormFieldInput>
          </FormField>

          <FormField>
            <FormFieldInput>
              <FormFieldLabel>{t("Client Id")}</FormFieldLabel>
              <InputText name="clientId" {...{ register, errors }} />
            </FormFieldInput>
          </FormField>

          <FormField>
            <FormFieldInput>
              <FormFieldLabel>{t("Scopes")}</FormFieldLabel>
              {scopes.length < 0 && <Skeleton height="50px" />}

              {scopes.length >= 0 && (
                /* @ts-ignore */
                <SelectCreate
                  options={scopes.map((scope: any) => ({
                    label: scope,
                    value: scope,
                  }))}
                  name="scopes"
                  {...{ register, errors, control }}
                />
              )}
            </FormFieldInput>
          </FormField>
        </div>
      </div>
    </form>
  );
};
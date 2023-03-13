import * as React from "react";
import * as styles from "./AuthenticationFormTemplate.module.css";
import FormField, { FormFieldInput, FormFieldLabel } from "@gemeente-denhaag/form-field";
import { useTranslation } from "react-i18next";
import { InputText, Textarea } from "@conduction/components";
import { useForm } from "react-hook-form";
import { useAuthentication } from "../../../hooks/authentication";
import { useQueryClient } from "react-query";
import { InputURL } from "@conduction/components/lib/components/formFields";
import { SelectCreate } from "@conduction/components/lib/components/formFields/select/select";
import Skeleton from "react-loading-skeleton";
import { useIsLoadingContext } from "../../../context/isLoading";

interface AuthenticationFormTemplateProps {
  authentication?: any;
}

export const formId: string = "authentication-provider-form";

export const AuthenticationFormTemplate: React.FC<AuthenticationFormTemplateProps> = ({ authentication }) => {
  const { t } = useTranslation();
  const [scopes, setScopes] = React.useState<any[]>([]);
  const { setIsLoading, isLoading } = useIsLoadingContext();

  const queryClient = useQueryClient();
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
    const basicFields: string[] = ["name", "authenticateUrl", "tokenUrl", "secret", "clientId", "keysUrl"];
    basicFields.forEach((field) => setValue(field, authentication[field]));

    setValue(
      "scopes",
      authentication["scopes"].map((scope: any) => ({ label: scope, value: scope })),
    );
  };

  const onSubmit = (data: any): void => {
    const payload = {
      ...data,
      scopes: data.scopes?.map((scope: any) => scope.value),
    };

    createOrEditAuthentication.mutate({ payload, id: authentication?.id });

    authentication?.id && queryClient.setQueryData(["organizations", authentication.id], data);
  };

  React.useEffect(() => {
    setIsLoading({ authenticationForm: createOrEditAuthentication.isLoading });
  }, [createOrEditAuthentication.isLoading]);

  React.useEffect(() => {
    authentication && handleSetFormValues(authentication);
    authentication && setScopes(authentication.scopes);
  }, [authentication]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} id={formId}>
      <div className={styles.gridContainer}>
        <div className={styles.grid}>
          <FormField>
            <FormFieldInput>
              <FormFieldLabel>{t("Provider Name")}</FormFieldLabel>
              <InputText
                {...{ register, errors }}
                name="name"
                validation={{ required: true }}
                disabled={isLoading.authenticationForm}
              />
            </FormFieldInput>
          </FormField>

          <FormField>
            <FormFieldInput>
              <FormFieldLabel>{t("Authenticate Url")}</FormFieldLabel>
              <InputURL name="authenticateUrl" {...{ register, errors }} disabled={isLoading.authenticationForm} />
            </FormFieldInput>
          </FormField>

          <FormField>
            <FormFieldInput>
              <FormFieldLabel>{t("Token Url")}</FormFieldLabel>
              <InputURL name="tokenUrl" {...{ register, errors }} disabled={isLoading.authenticationForm} />
            </FormFieldInput>
          </FormField>

          <FormField>
            <FormFieldInput>
              <FormFieldLabel>{t("Keys Url")}</FormFieldLabel>
              <InputURL name="keysUrl" {...{ register, errors }} disabled={isLoading.authenticationForm} />
            </FormFieldInput>
          </FormField>

          <FormField>
            <FormFieldInput>
              <FormFieldLabel>{t("Client Id")}</FormFieldLabel>
              <InputText name="clientId" {...{ register, errors }} disabled={isLoading.authenticationForm} />
            </FormFieldInput>
          </FormField>

          <FormField>
            <FormFieldInput>
              <FormFieldLabel>{t("Scopes")}</FormFieldLabel>
              {scopes.length < 0 && <Skeleton height="50px" />}

              {scopes.length >= 0 && (
                <SelectCreate
                  options={scopes.map((scope: any) => ({
                    label: scope,
                    value: scope,
                  }))}
                  name="scopes"
                  {...{ register, errors, control }}
                  disabled={isLoading.authenticationForm}
                />
              )}
            </FormFieldInput>
          </FormField>
        </div>
        <FormField>
          <FormFieldInput>
            <FormFieldLabel>{t("Secret")}</FormFieldLabel>
            <Textarea {...{ register, errors }} name="secret" disabled={isLoading.authenticationForm} />
          </FormFieldInput>
        </FormField>
      </div>
    </form>
  );
};

import * as React from "react";
import * as _ from "lodash";
import FormField, { FormFieldInput, FormFieldLabel } from "@gemeente-denhaag/form-field";
import { InputText, Textarea } from "@conduction/components";
import { useTranslation } from "react-i18next";
import { FieldValues, UseFormRegister } from "react-hook-form";
import { ErrorMessage } from "../../../components/errorMessage/ErrorMessage";
import { useIsLoadingContext } from "../../../context/isLoading";
import { enrichValidation } from "../../../services/enrichReactHookFormValidation";

export type TSourcesAuthType = "jwt-HS256" | "apikey" | "username-password" | "vrijbrp-jwt" | "pink-jwt";

interface ReactHookFormProps {
  register: UseFormRegister<FieldValues>;
  errors: { [x: string]: any };
}

interface SourcesAuthFormTemplateProps {
  selectedAuth: TSourcesAuthType;
  disabled?: boolean;
}

export const SourcesAuthFormTemplate: React.FC<SourcesAuthFormTemplateProps & ReactHookFormProps> = ({
  selectedAuth,
  ...rest
}) => {
  switch (selectedAuth) {
    case "apikey":
      return <ApiKeyForm {...rest} />;

    case "jwt-HS256":
      return <JwtForm {...rest} />;

    case "username-password":
      return <UsernamePasswordForm {...rest} />;

    case "vrijbrp-jwt":
      return <UsernamePasswordForm {...rest} />;

    case "pink-jwt":
      return <UsernamePasswordForm {...rest} />;

    default:
      return <></>;
  }
};

interface FormProps {
  register: UseFormRegister<FieldValues>;
  errors: { [x: string]: any };
  disabled?: boolean;
}

const ApiKeyForm: React.FC<FormProps> = ({ ...rest }) => {
  const { t } = useTranslation();
  const { isLoading } = useIsLoadingContext();

  return (
    <FormField>
      <FormFieldInput>
        <FormFieldLabel>{t("Api key")}</FormFieldLabel>
        <Textarea
          {...rest}
          name="apikey"
          validation={enrichValidation({ maxLength: 225 })}
          disabled={isLoading.sourceForm}
        />
        {rest.errors["apikey"] && <ErrorMessage message={rest.errors["apikey"].message} />}
      </FormFieldInput>
    </FormField>
  );
};

const JwtForm: React.FC<FormProps> = ({ ...rest }) => {
  const { t } = useTranslation();
  const { isLoading } = useIsLoadingContext();

  return (
    <>
      <FormField>
        <FormFieldInput>
          <FormFieldLabel>{t("JWT-HS256")}</FormFieldLabel>
          <Textarea {...rest} name="jwt" disabled={isLoading.sourceForm} />
          {rest.errors["jwt"] && <ErrorMessage message={rest.errors["jwt"].message} />}
        </FormFieldInput>
      </FormField>

      <FormField>
        <FormFieldInput>
          <FormFieldLabel>{t("Secret")}</FormFieldLabel>
          <Textarea {...rest} name="secret" disabled={isLoading.sourceForm} />
          {rest.errors["secret"] && <ErrorMessage message={rest.errors["secret"].message} />}
        </FormFieldInput>
      </FormField>

      <FormField>
        <FormFieldInput>
          <FormFieldLabel>{t("JWT Id")}</FormFieldLabel>
          <InputText {...rest} name="jwtId" disabled={isLoading.sourceForm} />
        </FormFieldInput>
      </FormField>
    </>
  );
};

const UsernamePasswordForm: React.FC<FormProps> = ({ ...rest }) => {
  const { t } = useTranslation();
  const { isLoading } = useIsLoadingContext();

  return (
    <>
      <FormField>
        <FormFieldInput>
          <FormFieldLabel>{t("Username")}</FormFieldLabel>
          <InputText
            {...rest}
            name="username"
            validation={enrichValidation({ required: true, maxLength: 225 })}
            disabled={isLoading.sourceForm}
          />
          {rest.errors["username"] && <ErrorMessage message={rest.errors["username"].message} />}
        </FormFieldInput>
      </FormField>

      <FormField>
        <FormFieldInput>
          <FormFieldLabel>{t("Password")}</FormFieldLabel>
          <InputText
            {...rest}
            name="password"
            validation={enrichValidation({ required: true, maxLength: 225 })}
            disabled={isLoading.sourceForm}
          />
          {rest.errors["password"] && <ErrorMessage message={rest.errors["password"].message} />}
        </FormFieldInput>
      </FormField>
    </>
  );
};

import * as React from "react";
import * as _ from "lodash";
import FormField, { FormFieldInput, FormFieldLabel } from "@gemeente-denhaag/form-field";
import { InputText, Textarea } from "@conduction/components";
import { useTranslation } from "react-i18next";
import { FieldValues, UseFormRegister } from "react-hook-form";
import { ErrorMessage } from "../../../components/errorMessage/ErrorMessage";
import { useIsLoadingContext } from "../../../context/isLoading";

export type TSourcesAuthType = "jwt-HS256" | "apikey" | "username-password" | "vrijbrp-jwt";

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
  register,
  errors,
  disabled,
}) => {
  switch (selectedAuth) {
    case "apikey":
      return <ApiKeyForm {...{ register, errors, disabled }} />;

    case "jwt-HS256":
      return <JwtForm {...{ register, errors, disabled }} />;

    case "username-password":
      return <UsernamePasswordForm {...{ register, errors, disabled }} />;

    case "vrijbrp-jwt":
      return <UsernamePasswordForm {...{ register, errors, disabled }} />;

    default:
      return <></>;
  }
};

interface FormProps {
  register: UseFormRegister<FieldValues>;
  errors: { [x: string]: any };
  disabled?: boolean;
}

const ApiKeyForm: React.FC<FormProps> = ({ register, errors, disabled }) => {
  const { t } = useTranslation();
  const { isLoading } = useIsLoadingContext();

  return (
    <FormField>
      <FormFieldInput>
        <FormFieldLabel>{t("Api key")}</FormFieldLabel>
        <Textarea
          {...{ register, errors, disabled }}
          name="apikey"
          validation={{ maxLength: 225 }}
          disabled={isLoading.sourceForm}
        />
        {errors["apikey"] && <ErrorMessage message={errors["apikey"].message} />}
      </FormFieldInput>
    </FormField>
  );
};

const JwtForm: React.FC<FormProps> = ({ register, errors, disabled }) => {
  const { t } = useTranslation();
  const { isLoading } = useIsLoadingContext();

  return (
    <FormField>
      <FormFieldInput>
        <FormFieldLabel>{t("JWT-HS256")}</FormFieldLabel>
        <Textarea {...{ register, errors, disabled }} name="jwt" disabled={isLoading.sourceForm} />
      </FormFieldInput>
    </FormField>
  );
};

const UsernamePasswordForm: React.FC<FormProps> = ({ register, errors, disabled }) => {
  const { t } = useTranslation();
  const { isLoading } = useIsLoadingContext();

  return (
    <>
      <FormField>
        <FormFieldInput>
          <FormFieldLabel>{t("Username")}</FormFieldLabel>
          <InputText
            {...{ register, errors, disabled }}
            name="username"
            validation={{ required: true, maxLength: 225 }}
            disabled={isLoading.sourceForm}
          />
          {errors["username"] && <ErrorMessage message={errors["username"].message} />}
        </FormFieldInput>
      </FormField>

      <FormField>
        <FormFieldInput>
          <FormFieldLabel>{t("Password")}</FormFieldLabel>
          <InputText
            {...{ register, errors, disabled }}
            name="password"
            validation={{ required: true, maxLength: 225 }}
            disabled={isLoading.sourceForm}
          />
          {errors["password"] && <ErrorMessage message={errors["password"].message} />}
        </FormFieldInput>
      </FormField>
    </>
  );
};

import * as React from "react";
import * as _ from "lodash";
import FormField, { FormFieldInput, FormFieldLabel } from "@gemeente-denhaag/form-field";
import { InputText, Textarea } from "@conduction/components";
import { useTranslation } from "react-i18next";
import { FieldValues, UseFormRegister } from "react-hook-form";

export type TSourcesAuthType = "jwt" | "apikey" | "username-password" | "none";

interface ReactHookFormProps {
  register: UseFormRegister<FieldValues>;
  errors: { [x: string]: any };
}

interface SourcesAuthFormTemplateProps {
  selectedAuth: TSourcesAuthType;
}

export const SourcesAuthFormTemplate: React.FC<SourcesAuthFormTemplateProps & ReactHookFormProps> = ({
  selectedAuth,
  register,
  errors,
}) => {
  const { t } = useTranslation();
  const [loading, setLoading] = React.useState<boolean>(false);

  switch (selectedAuth) {
    case "none":
      return <></>;
    case "apikey":
      return (
        <FormField>
          <FormFieldInput>
            <FormFieldLabel>{t("Api key")}</FormFieldLabel>
            <Textarea {...{ register, errors }} name="apikey" disabled={loading} />
          </FormFieldInput>
        </FormField>
      );

    case "username-password":
      return (
        <>
          <FormField>
            <FormFieldInput>
              <FormFieldLabel>{t("Username")}</FormFieldLabel>
              <InputText {...{ register, errors }} name="username" validation={{ required: true }} disabled={loading} />
            </FormFieldInput>
          </FormField>

          <FormField>
            <FormFieldInput>
              <FormFieldLabel>{t("Password")}</FormFieldLabel>
              <InputText {...{ register, errors }} name="password" validation={{ required: true }} disabled={loading} />
            </FormFieldInput>
          </FormField>
        </>
      );

    case "jwt":
      return (
        <FormField>
          <FormFieldInput>
            <FormFieldLabel>{t("JWT")}</FormFieldLabel>
            <Textarea {...{ register, errors }} name="jwt" disabled={loading} />
          </FormFieldInput>
        </FormField>
      );
  }
};

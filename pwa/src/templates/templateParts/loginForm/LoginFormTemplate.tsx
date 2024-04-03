import * as React from "react";
import * as styles from "./LoginFormTemplate.module.css";
import { useForm } from "react-hook-form";
import { Button, FormField, FormFieldInput, FormFieldLabel } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { InputText, InputPassword } from "@conduction/components";
import { navigate } from "gatsby";
import { useGatsbyContext } from "../../../context/gatsby";
import { useAuthentication } from "../../../hooks/useAuthentication";
import { useIsLoadingContext } from "../../../context/isLoading";
import { enrichValidation } from "../../../services/enrichReactHookFormValidation";

export const LoginFormTemplate: React.FC = () => {
  const { t } = useTranslation();
  const { gatsbyContext } = useGatsbyContext();
  const { handleInternalLogin, isLoading: authenticationIsLoading } = useAuthentication();
  const { isLoading, setIsLoading } = useIsLoadingContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data: any) => {
    handleInternalLogin(data).then(() => {
      navigate(gatsbyContext.previousPath ?? "/");
    });
  };

  React.useEffect(() => setIsLoading({ loginForm: authenticationIsLoading }), [authenticationIsLoading]);

  return (
    <form className={styles.container} onSubmit={handleSubmit(onSubmit)}>
      <FormField>
        <FormFieldInput>
          <FormFieldLabel>{t("Username")}</FormFieldLabel>
          <InputText
            {...{ register, errors }}
            name="username"
            validation={enrichValidation({ required: true })}
            disabled={isLoading?.loginForm}
            ariaLabel={t("Enter username")}
          />
        </FormFieldInput>
      </FormField>
      <FormField>
        <FormFieldLabel>{t("Password")}</FormFieldLabel>
        <FormFieldInput>
          <InputPassword
            {...{ register, errors }}
            name="password"
            validation={enrichValidation({ required: true })}
            disabled={isLoading?.loginForm}
            ariaLabel={t("Enter password")}
          />
        </FormFieldInput>
      </FormField>

      <Button disabled={isLoading?.loginForm} size="large" type="submit">
        {t("Send")}
      </Button>
    </form>
  );
};

import * as React from "react";
import { useForm } from "react-hook-form";
import APIContext from "../../../apiService/apiContext";
import { Button, FormField, FormFieldInput, FormFieldLabel } from "@gemeente-denhaag/components-react";
import * as styles from "./LoginFormTemplate.module.css";
import { useTranslation } from "react-i18next";
import APIService from "../../../apiService/apiService";
import { InputText, InputPassword } from "@conduction/components";
import { navigate } from "gatsby";
import { useGatsbyContext } from "../../../context/gatsby";
import { useIsLoadingContext } from "../../../context/isLoading";
import { useAuthentication } from "../../../hooks/useAuthentication";

export const LoginFormTemplate: React.FC = () => {
  const { t } = useTranslation();
  const { gatsbyContext } = useGatsbyContext();
  const { isLoading } = useIsLoadingContext();
  const { handleLogin } = useAuthentication();

  const API: APIService | null = React.useContext(APIContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data: any) => {
    API &&
      handleLogin(data, API).then(() => {
        navigate(gatsbyContext.previousPath ?? "/");
      });
  };

  React.useEffect(() => {
    console.log({ isLoading });
  }, [isLoading]);

  return (
    <form className={styles.container} onSubmit={handleSubmit(onSubmit)}>
      <FormField>
        <FormFieldInput>
          <FormFieldLabel>{t("Username")}</FormFieldLabel>
          <InputText
            {...{ register, errors }}
            name="username"
            validation={{ required: true }}
            disabled={isLoading?.loginForm}
          />
        </FormFieldInput>
      </FormField>
      <FormField>
        <FormFieldLabel>{t("Password")}</FormFieldLabel>
        <FormFieldInput>
          <InputPassword
            {...{ register, errors }}
            name="password"
            validation={{ required: true }}
            disabled={isLoading?.loginForm}
          />
        </FormFieldInput>
      </FormField>

      <Button size="large" type="submit">
        {t("Send")}
      </Button>
    </form>
  );
};

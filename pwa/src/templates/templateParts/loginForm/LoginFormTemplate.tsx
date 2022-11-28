import * as React from "react";
import { useForm } from "react-hook-form";
import { handleLogin } from "../../../services/auth";
import APIContext from "../../../apiService/apiContext";
import { Button, FormField, FormFieldInput, FormFieldLabel } from "@gemeente-denhaag/components-react";
import * as styles from "./LoginFormTemplate.module.css";
import { useTranslation } from "react-i18next";
import APIService from "../../../apiService/apiService";
import { InputText, InputPassword } from "@conduction/components";

export const LoginFormTemplate: React.FC = () => {
  const { t } = useTranslation();
  const API: APIService | null = React.useContext(APIContext);
  const [loading, setLoading] = React.useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data: any) => {
    setLoading(true);

    API &&
      handleLogin(data, API)
        .catch(() => undefined)
        .finally(() => {
          setLoading(false);
        });
  };

  return (
    <form className={styles.container} onSubmit={handleSubmit(onSubmit)}>
      <FormField>
        <FormFieldInput>
          <FormFieldLabel>{t("Username")}</FormFieldLabel>
          <InputText {...{ register, errors }} name="username" validation={{ required: true }} disabled={loading} />
        </FormFieldInput>
      </FormField>
      <FormField>
        <FormFieldLabel>{t("Password")}</FormFieldLabel>
        <FormFieldInput>
          <InputPassword {...{ register, errors }} name="password" validation={{ required: true }} disabled={loading} />
        </FormFieldInput>
      </FormField>

      <Button size="large" type="submit" disabled={loading}>
        {t("Send")}
      </Button>
    </form>
  );
};

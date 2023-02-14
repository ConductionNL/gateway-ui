import * as React from "react";
import * as styles from "./LoginTemplate.module.css";
import { Heading1 } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { LoginFormTemplate } from "../templateParts/loginForm/LoginFormTemplate";
import { useQueryClient } from "react-query";

export const LoginTemplate: React.FC = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  React.useEffect(() => {
    queryClient.removeQueries();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <Heading1 className={styles.header}>{t("Login")}</Heading1>

        <LoginFormTemplate />
      </div>
    </div>
  );
};

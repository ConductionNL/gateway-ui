import * as React from "react";
import * as styles from "./LoginTemplate.module.css";
import { Heading1 } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { LoginFormTemplate } from "../templateParts/loginForm/LoginFormTemplate";
import { useQueryClient } from "react-query";
import { navigate } from "gatsby";
import { Button } from "../../components/button/Button";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";

export const LoginTemplate: React.FC = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const fullURL = new URL(typeof window !== "undefined" ? window.location.href : "localhost:8000");
  fullURL.port = "";

  const url = fullURL.toString();

  React.useEffect(() => {
    queryClient.removeQueries();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <Heading1 className={styles.header}>{t("Login")}</Heading1>

        <LoginFormTemplate />

        <div className={styles.externalButton}>
          <Button
            variant="primary"
            label={t("Login using ADFS")}
            icon={faArrowUpRightFromSquare}
            onClick={() => navigate(`${url}login/oidc/dex`)}
          />
        </div>
      </div>
    </div>
  );
};

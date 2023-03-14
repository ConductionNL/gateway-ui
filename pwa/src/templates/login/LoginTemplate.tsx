import * as React from "react";
import * as styles from "./LoginTemplate.module.css";
import { Heading1 } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { LoginFormTemplate } from "../templateParts/loginForm/LoginFormTemplate";
import { useQueryClient } from "react-query";
import { navigate } from "gatsby";
import { Button } from "../../components/button/Button";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import APIContext from "../../apiService/apiContext";
import APIService from "../../apiService/apiService";
import { useIsLoadingContext } from "../../context/isLoading";
import toast from "react-hot-toast";
import { useAuthentication } from "../../hooks/useAuthentication";

export const LoginTemplate: React.FC = () => {
  const { t } = useTranslation();
  const { handleRenewToken } = useAuthentication();
  const [dexCallback, setDexCallback] = React.useState<boolean>(false);
  const { isLoading } = useIsLoadingContext();

  const API: APIService | null = React.useContext(APIContext);
  const queryClient = useQueryClient();

  const fullURL = new URL(typeof window !== "undefined" ? window.location.href : "localhost:8000");
  fullURL.port = "";

  const url = fullURL.toString();

  const handleDexLogin = () => {
    navigate(`${url}login/oidc/dex`);
    toast.loading("Redirecting to ADFS...");
  };

  React.useEffect(() => {
    queryClient.removeQueries();
  }, []);

  React.useEffect(() => {
    setDexCallback(document.referrer !== "" && document.referrer !== window.location.href);
  }, []);

  React.useEffect(() => {
    if (dexCallback) {
      handleRenewToken(API).then(() => {
        location.href = "/";
        setDexCallback(false);
      });
    }
  }, [dexCallback]);

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
            onClick={handleDexLogin}
            disabled={isLoading?.loginForm}
          />
        </div>
      </div>
    </div>
  );
};

import * as React from "react";
import * as styles from "./LoginTemplate.module.css";
import { Heading1 } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { LoginFormTemplate } from "../templateParts/loginForm/LoginFormTemplate";
import { useQueryClient } from "react-query";
import { navigate } from "gatsby";
import { Button } from "../../components/button/Button";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";
import { useAuthentication } from "../../hooks/useAuthentication";
import { useIsLoadingContext } from "../../context/isLoading";
import APIService from "../../apiService/apiService";
import APIContext from "../../apiService/apiContext";

export const LoginTemplate: React.FC = () => {
  const { t } = useTranslation();
  const { handleExternalLogin, isLoading: authenticationIsLoading } = useAuthentication();
  const { isLoading, setIsLoading } = useIsLoadingContext();
  const [API] = React.useState<APIService>(React.useContext(APIContext));

  const [redirectedFromDex, setRedirectedFromDex] = React.useState<boolean>(false); // is set when the user was redirected BACK to this LoginTemplate from DEX
  const [dexRedirectURL, setDexRedirectURL] = React.useState<string>("");

  const queryClient = useQueryClient();

  const handleDexLogin = () => {
    navigate(dexRedirectURL);
    toast.loading("Redirecting to ADFS...");
  };

  React.useEffect(() => setIsLoading({ loginForm: authenticationIsLoading }), [authenticationIsLoading]);

  React.useEffect(() => {
    queryClient.removeQueries();
    API.authenticated && navigate("/"); // checks if user is authenticated or not to prevent use of /login route
  }, []);

  React.useEffect(() => {
    setRedirectedFromDex(document.referrer !== "" && document.referrer !== window.location.href);
  }, []);

  React.useEffect(() => {
    redirectedFromDex && handleExternalLogin();
  }, [redirectedFromDex]);

  React.useEffect(() => {
    window.sessionStorage.getItem("GATSBY_BASE_URL") &&
      setDexRedirectURL(`${window.sessionStorage.getItem("GATSBY_BASE_URL")}/login/oidc/dex`);
  });

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

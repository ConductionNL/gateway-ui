import * as React from "react";
import * as styles from "./LoginTemplate.module.css";
import { Heading1 } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { LoginFormTemplate } from "../templateParts/loginForm/LoginFormTemplate";
import { useQueryClient } from "react-query";
import { navigate } from "gatsby";
import { Button } from "../../components/button/Button";
import { faArrowLeft, faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";
import { useAuthentication } from "../../hooks/useAuthentication";
import { useIsLoadingContext } from "../../context/isLoading";

export const LoginTemplate: React.FC = () => {
  const { t } = useTranslation();
  const [redirectedFromADFS, setRedirectedFromADFS] = React.useState<boolean>(false);
  const { handleExternalLogin, isLoading: authenticationIsLoading } = useAuthentication();
  const { isLoading, setIsLoading } = useIsLoadingContext();

  const [dexRedirectURL, setDexRedirectURL] = React.useState<string>("");

  const queryClient = useQueryClient();

  const handleDexLogin = () => {
    document.cookie = "redirected_to_adfs=true";
    navigate(dexRedirectURL);
    // toast.loading("Redirecting to ADFS...");
  };

  const backToLogin = () => {
    document.cookie = "redirected_to_adfs=false";
    setRedirectedFromADFS(false);
  };

  React.useEffect(() => setIsLoading({ loginForm: authenticationIsLoading }), [authenticationIsLoading]);

  React.useEffect(() => {
    queryClient.removeQueries();
  }, []);

  React.useEffect(() => setRedirectedFromADFS(getCookieValueByName("redirected_to_adfs") === "true"), []);

  React.useEffect(() => {
    redirectedFromADFS && handleExternalLogin();
  }, [redirectedFromADFS]);

  React.useEffect(() => {
    window.sessionStorage.getItem("GATSBY_BASE_URL") &&
      setDexRedirectURL(`${window.sessionStorage.getItem("GATSBY_BASE_URL")}/login/oidc/dex`);
  });

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {!redirectedFromADFS && (
          <>
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
          </>
        )}

        {redirectedFromADFS && (
          <>
            {isLoading?.loginForm && <p>Logging in using external provider.</p>}

            {!isLoading?.loginForm && (
              <div className={styles.failedToLoginContent}>
                <Heading1>Oops!, something went wrong</Heading1>
                <p>Sorry, but we're having trouble signing you in using the external provider.</p>
                <Button variant="primary" label={t("Return to login")} icon={faArrowLeft} onClick={backToLogin} />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

const getCookieValueByName = (name: string): string | null => {
  const cookieString = document.cookie;
  const cookies = cookieString.split(";");

  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    const [cookieName, cookieValue] = cookie.split("=");

    if (cookieName === name) {
      return decodeURIComponent(cookieValue);
    }
  }

  // Cookie not found
  return null;
};

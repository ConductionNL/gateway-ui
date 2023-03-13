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
import { handleRenewToken } from "../../services/auth";
import { useGatsbyContext } from "../../context/gatsby";

export const LoginTemplate: React.FC = () => {
  const { t } = useTranslation();
  const { gatsbyContext } = useGatsbyContext();
  const API: APIService | null = React.useContext(APIContext);
  const queryClient = useQueryClient();

  const fullURL = new URL(typeof window !== "undefined" ? window.location.href : "localhost:8000");
  fullURL.port = "";

  const url = fullURL.toString();

  console.log(document.referrer);
  React.useEffect(() => {
    queryClient.removeQueries();
  }, []);

  // React.useEffect(() => {
  //   if (document.referrer === "http://localhost:5556/") {
  //     API &&
  //       handleRenewToken(API).then(() => {
  //         navigate(gatsbyContext.previousPath ?? "/");
  //       });
  //   }
  // }, [document.referrer === "http://localhost:5556/"]);

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
            onClick={() => navigate(`/adfs`)}
          />
        </div>
      </div>
    </div>
  );
};

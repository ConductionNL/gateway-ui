import * as React from "react";
import * as styles from "./AuthenticationFormTemplate.module.css";
import { Button, Heading1 } from "@gemeente-denhaag/components-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import { AuthenticationFormTemplate } from "./AuthenticationFormTemplate";
import clsx from "clsx";

export const CreateAuthenticationFormTemplate: React.FC = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = React.useState<boolean>(false);

  return (
    <div className={styles.container}>
      <section className={styles.section}>
        <Heading1>Create Authentication Provider</Heading1>

        <div className={styles.buttons}>
          <Button className={clsx(styles.buttonIcon, styles.button)} type="submit" form="AuthForm" disabled={loading}>
            <FontAwesomeIcon icon={faFloppyDisk} />
            {t("Save")}
          </Button>
        </div>
      </section>

      <AuthenticationFormTemplate />
    </div>
  );
};

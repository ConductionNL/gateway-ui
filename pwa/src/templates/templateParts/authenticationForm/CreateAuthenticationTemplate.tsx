import * as React from "react";
import * as styles from "./AuthenticationFormTemplate.module.css";
import clsx from "clsx";

import { useTranslation } from "react-i18next";
import { Button, Heading1 } from "@gemeente-denhaag/components-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import { IsLoadingContext } from "../../../context/isLoading";
import { AuthenticationFormTemplate, formId } from "./AuthenticationFormTemplate";

export const CreateAuthenticationTemplate: React.FC = () => {
  const { t } = useTranslation();
  const [isLoading] = React.useContext(IsLoadingContext);

  return (
    <div className={styles.container}>
      <section className={styles.section}>
        <Heading1>Create Authentication Provider</Heading1>

        <div className={styles.buttons}>
          <Button
            type="submit"
            form={formId}
            disabled={isLoading.authenticationForm}
            className={clsx(styles.buttonIcon, styles.button)}
          >
            <FontAwesomeIcon icon={faFloppyDisk} />
            {t("Save")}
          </Button>
        </div>
      </section>

      <AuthenticationFormTemplate />
    </div>
  );
};

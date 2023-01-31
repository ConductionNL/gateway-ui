import * as React from "react";
import * as styles from "./ApplicationTemplate.module.css";
import { Button, Heading1 } from "@gemeente-denhaag/components-react";
import { ApplicationsFormTemplate, formId } from "../templateParts/applicationsForm/ApplicationsFormTemplate";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import clsx from "clsx";
import { IsLoadingContext } from "../../context/isLoading";

export const CreateApplicationTemplate: React.FC = () => {
  const { t } = useTranslation();
  const [isLoading] = React.useContext(IsLoadingContext);

  return (
    <div className={styles.container}>
      <section className={styles.section}>
        <Heading1>{"Create Application"}</Heading1>
        <div className={styles.buttons}>
          <Button
            form={formId}
            type="submit"
            disabled={isLoading.applicationForm}
            className={clsx(styles.buttonIcon, styles.button)}
          >
            <FontAwesomeIcon icon={faFloppyDisk} />
            {t("Save")}
          </Button>
        </div>
      </section>

      <ApplicationsFormTemplate />
    </div>
  );
};

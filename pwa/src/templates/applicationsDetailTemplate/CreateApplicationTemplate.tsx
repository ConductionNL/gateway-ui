import * as React from "react";
import * as styles from "./ApplicationTemplate.module.css";
import { Button, Heading1 } from "@gemeente-denhaag/components-react";
import { ApplicationsFormTemplate } from "../templateParts/applicationsForm/ApplicationsFormTemplate";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk } from "@fortawesome/free-solid-svg-icons";

interface CreateApplicationTemplateProps {}

export const CreateApplicationTemplate: React.FC<CreateApplicationTemplateProps> = ({}) => {
  const { t } = useTranslation();

  let saveFunction: Function;
  const getSave = (save: Function) => (saveFunction = save);

  return (
    <div className={styles.container}>
      <section className={styles.section}>
        <Heading1>{"Create Application"}</Heading1>
        <div className={styles.buttons}>
          <Button className={styles.buttonIcon} onClick={() => saveFunction()} type="submit">
            <FontAwesomeIcon icon={faFloppyDisk} />
            {t("Save")}
          </Button>
        </div>
      </section>
      <ApplicationsFormTemplate getSave={getSave} />
    </div>
  );
};

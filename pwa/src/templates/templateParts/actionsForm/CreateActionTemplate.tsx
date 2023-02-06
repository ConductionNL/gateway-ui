import * as React from "react";
import * as styles from "./ActionFormTemplate.module.css";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import { Heading1, Button } from "@gemeente-denhaag/components-react";
import { ActionFormTemplate, formId } from "./ActionFormTemplate";
import { IsLoadingContext } from "../../../context/isLoading";

export const CreateActionTemplate: React.FC = () => {
  const { t } = useTranslation();
  const [isLoading] = React.useContext(IsLoadingContext);

  return (
    <div className={styles.container}>
      <section className={styles.section}>
        <Heading1>{t("Create Action")}</Heading1>

        <div className={styles.buttons}>
          <Button
            type="submit"
            form={formId}
            disabled={isLoading.actionForm}
            className={clsx(styles.buttonIcon, styles.button)}
          >
            <FontAwesomeIcon icon={faFloppyDisk} />
            {t("Save")}
          </Button>
        </div>
      </section>

      <ActionFormTemplate />
    </div>
  );
};

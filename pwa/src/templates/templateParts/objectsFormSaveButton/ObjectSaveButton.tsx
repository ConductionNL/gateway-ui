import * as React from "react";
import * as styles from "./ObjectSaveButton.module.css";
import { faEllipsis, faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "react-i18next";
import Button from "@gemeente-denhaag/button";
import clsx from "clsx";

const ObjectSaveButton: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div>
      <Button className={clsx(styles.buttonIcon, styles.primaryButton)} type="submit">
        <FontAwesomeIcon icon={faFloppyDisk} />
        {t("Save")}
      </Button>
      <Button className={styles.secondaryButton}>
        <FontAwesomeIcon icon={faEllipsis} />
      </Button>
    </div>
  );
};

export default ObjectSaveButton;

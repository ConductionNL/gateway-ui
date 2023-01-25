import * as React from "react";
import * as styles from "./ObjectSaveButton.module.css";
import { faEllipsis, faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "react-i18next";
import Button from "@gemeente-denhaag/button";
import clsx from "clsx";

interface ObjectSaveButtonProps {
  onSave: () => null | any;
  onSaveClose: () => null | any;
  onSaveCreateNew?: () => null | any;
}

const ObjectSaveButton: React.FC<ObjectSaveButtonProps> = ({ onSave, onSaveClose, onSaveCreateNew }) => {
  const { t } = useTranslation();
  const [menuEnabled, setMenuEnabled] = React.useState<boolean>(false);

  function handleBlur() {
    requestAnimationFrame(() => {
      setMenuEnabled(false);
    });
  }

  function handleSaveOptions(fn: Function) {
    fn();

    return false;
  }

  return (
    <div className={styles.container}>
      <div className={styles.saveButtonContainer}>
        <Button onClick={onSave} className={clsx(styles.buttonIcon, styles.primaryButton)}>
          <FontAwesomeIcon icon={faFloppyDisk} />
          {t("Save")}
        </Button>
        <Button onClick={() => setMenuEnabled(!menuEnabled)} onBlur={handleBlur} className={styles.secondaryButton}>
          <FontAwesomeIcon icon={faEllipsis} />
        </Button>
      </div>

      <div className={clsx(styles.optionsContainer, menuEnabled && styles.optionsContainerEnabled)}>
        <span className={styles.triangle} />

        <div className={styles.options}>
          <button
            onMouseDown={() => handleSaveOptions(onSaveClose)}
            className={clsx(styles.buttonIcon, styles.optionsButton)}
          >
            <FontAwesomeIcon icon={faFloppyDisk} />
            {t("Save and Close")}
          </button>

          {onSaveCreateNew && (
            <button
              onMouseDown={() => handleSaveOptions(onSaveCreateNew)}
              className={clsx(styles.buttonIcon, styles.optionsButton)}
            >
              <FontAwesomeIcon icon={faFloppyDisk} />
              {t("Save and Create New")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ObjectSaveButton;

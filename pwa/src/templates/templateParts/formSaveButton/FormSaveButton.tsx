import * as React from "react";
import * as styles from "./FormSaveButton.module.css";
import { faEllipsis, faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "react-i18next";
import Button from "@gemeente-denhaag/button";
import clsx from "clsx";

export type TAfterSuccessfulFormSubmit = "save" | "saveAndClose" | "saveAndCreateNew";

interface FormSaveButtonProps {
  setAfterSuccessfulFormSubmit: React.Dispatch<React.SetStateAction<TAfterSuccessfulFormSubmit>>;
  disabled?: boolean;
}

export const FormSaveButton: React.FC<FormSaveButtonProps> = ({ setAfterSuccessfulFormSubmit, disabled }) => {
  const { t } = useTranslation();
  const [menuEnabled, setMenuEnabled] = React.useState<boolean>(false);

  function handleBlur() {
    setTimeout(() => {
      setMenuEnabled(false);
    }, 100);
  }

  return (
    <div className={styles.container}>
      <div className={styles.saveButtonContainer}>
        <Button
          type="submit"
          onClick={() => setAfterSuccessfulFormSubmit("save")}
          className={clsx(styles.buttonIcon, styles.primaryButton)}
          {...{ disabled }}
        >
          <FontAwesomeIcon icon={faFloppyDisk} />
          {t("Save")}
        </Button>
        <Button
          onClick={(e) => {
            e.preventDefault();
            setMenuEnabled(!menuEnabled);
          }}
          onBlur={handleBlur}
          className={styles.secondaryButton}
          {...{ disabled }}
        >
          <FontAwesomeIcon icon={faEllipsis} />
        </Button>
      </div>

      <div className={clsx(styles.optionsContainer, menuEnabled && styles.optionsContainerEnabled)}>
        <span className={styles.triangle} />

        <div className={styles.options}>
          <button
            type="submit"
            onMouseDown={() => setAfterSuccessfulFormSubmit("saveAndClose")}
            className={clsx(styles.buttonIcon, styles.optionsButton)}
          >
            <FontAwesomeIcon icon={faFloppyDisk} />
            {t("Save and Close")}
          </button>

          <button
            type="submit"
            onMouseDown={() => setAfterSuccessfulFormSubmit("saveAndCreateNew")}
            className={clsx(styles.buttonIcon, styles.optionsButton)}
          >
            <FontAwesomeIcon icon={faFloppyDisk} />
            {t("Save and Create New")}
          </button>
        </div>
      </div>
    </div>
  );
};

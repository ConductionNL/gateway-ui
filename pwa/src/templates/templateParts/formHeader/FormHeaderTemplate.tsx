import * as React from "react";
import * as styles from "./FormHeaderTemplate.module.css";

import { t } from "i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Heading1, Button } from "@gemeente-denhaag/components-react";
import { faFloppyDisk, faMinus, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import clsx from "clsx";

interface FormHeaderTemplateProps {
  title: string;
  formId?: string;
  disabled?: boolean;
  handleToggleDashboard?: {
    isActive?: boolean;
    handleToggle: () => any;
  };
  handleDelete?: () => any;

  customElements?: JSX.Element;
}

export const FormHeaderTemplate: React.FC<FormHeaderTemplateProps> = ({
  title,
  formId,
  handleToggleDashboard,
  handleDelete,
  disabled,
  customElements,
}) => {
  return (
    <section className={styles.container}>
      <Heading1 className={styles.title}>{title}</Heading1>

      <div className={styles.buttonsContainer}>
        {customElements && customElements}

        {formId && (
          <Button type="submit" form={formId} {...{ disabled }} className={styles.buttonContentWrap}>
            <FontAwesomeIcon icon={faFloppyDisk} />
            {t("Save")}
          </Button>
        )}

        {handleToggleDashboard && (
          <Button {...{ disabled }} onClick={handleToggleDashboard.handleToggle} className={styles.buttonContentWrap}>
            <FontAwesomeIcon icon={handleToggleDashboard.isActive ? faMinus : faPlus} />
            {handleToggleDashboard.isActive ? t("Remove from dashboard") : t("Add to dashboard")}
          </Button>
        )}

        {handleDelete && (
          <Button
            {...{ disabled }}
            onClick={handleDelete}
            className={clsx(styles.deleteButton, styles.buttonContentWrap)}
          >
            <FontAwesomeIcon icon={faTrash} />
            {t("Delete")}
          </Button>
        )}
      </div>
    </section>
  );
};

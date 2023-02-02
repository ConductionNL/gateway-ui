import * as React from "react";
import * as styles from "./FormHeaderTemplate.module.css";

import { t } from "i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Heading1, Button } from "@gemeente-denhaag/components-react";
import { faFloppyDisk, faMinus, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";

interface FormHeaderTemplateProps {
  title: string;
  formId: string;
  handleToggleDashboard?: {
    isActive?: boolean;
    handleToggle: () => any;
  };
  handleDelete?: () => any;
  disabled?: boolean;
}

export const FormHeaderTemplate: React.FC<FormHeaderTemplateProps> = ({
  title,
  formId,
  handleToggleDashboard,
  handleDelete,
  disabled,
}) => {
  return (
    <section className={styles.container}>
      <Heading1>{title}</Heading1>

      <div className={styles.buttonsContainer}>
        <Button type="submit" form={formId} {...{ disabled }}>
          <FontAwesomeIcon icon={faFloppyDisk} />
          {t("Save")}
        </Button>

        {handleToggleDashboard && (
          <Button {...{ disabled }} onClick={handleToggleDashboard.handleToggle}>
            <FontAwesomeIcon icon={handleToggleDashboard.isActive ? faMinus : faPlus} />
            {handleToggleDashboard ? t("Remove from dashboard") : t("Add to dashboard")}
          </Button>
        )}

        {handleDelete && (
          <Button {...{ disabled }} onClick={handleDelete} className={styles.deleteButton}>
            <FontAwesomeIcon icon={faTrash} />
            {t("Delete")}
          </Button>
        )}
      </div>
    </section>
  );
};

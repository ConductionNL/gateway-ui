import * as React from "react";
import * as styles from "./FormHeaderTemplate.module.css";

import { t } from "i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Heading1, Button } from "@gemeente-denhaag/components-react";
import { faFloppyDisk, faMinus, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { ToolTip } from "@conduction/components";

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
  showTitleTooltip?: boolean;
}

export const FormHeaderTemplate: React.FC<FormHeaderTemplateProps> = ({
  title,
  formId,
  handleToggleDashboard,
  handleDelete,
  disabled,
  customElements,
  showTitleTooltip,
}) => {
  return (
    <section className={styles.container}>
      {showTitleTooltip ? (
        <ToolTip tooltip={title}>
          <Heading1 className={styles.title}>{title}</Heading1>
        </ToolTip>
      ) : (
        <Heading1 className={styles.title}>{title}</Heading1>
      )}

      <div className={styles.buttonsContainer}>
        {customElements && customElements}

        {formId && (
          <Button type="submit" form={formId} {...{ disabled }}>
            <FontAwesomeIcon icon={faFloppyDisk} />
            {t("Save")}
          </Button>
        )}

        {handleToggleDashboard && (
          <Button {...{ disabled }} onClick={handleToggleDashboard.handleToggle}>
            <FontAwesomeIcon icon={handleToggleDashboard.isActive ? faMinus : faPlus} />
            {handleToggleDashboard.isActive ? t("Remove from dashboard") : t("Add to dashboard")}
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

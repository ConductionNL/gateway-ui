import * as React from "react";
import * as styles from "./FormHeaderTemplate.module.css";

import { t } from "i18next";
import { Heading1 } from "@gemeente-denhaag/components-react";
import { faClose, faMinus, faPlus, faSave, faTrash } from "@fortawesome/free-solid-svg-icons";
import { ToolTip, NotificationPopUp as _NotificationPopUp } from "@conduction/components";
import { Button } from "../../../components/button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
  const { isVisible, show, hide } = _NotificationPopUp.controller();
  const NotificationPopUp = _NotificationPopUp.NotificationPopUp;

  return (
    <section className={styles.container}>
      {showTitleTooltip && (
        <ToolTip layoutClassName={styles.tooltipContainer} tooltip={title}>
          <Heading1 className={styles.title}>{title}</Heading1>
        </ToolTip>
      )}

      {!showTitleTooltip && <Heading1 className={styles.title}>{title}</Heading1>}

      <div className={styles.buttonsContainer}>
        {customElements && customElements}

        {formId && (
          <Button variant="primary" type="submit" form={formId} label={t("Save")} icon={faSave} {...{ disabled }} />
        )}

        {handleToggleDashboard && (
          <Button
            variant="primary"
            onClick={handleToggleDashboard.handleToggle}
            icon={handleToggleDashboard.isActive ? faMinus : faPlus}
            label={handleToggleDashboard.isActive ? t("Remove from dashboard") : t("Add to dashboard")}
            {...{ disabled }}
          />
        )}

        {handleDelete && (
          <>
            <Button variant="danger" onClick={() => show()} icon={faTrash} label={t("Delete")} {...{ disabled }} />

            {isVisible && (
              <div className={styles.overlay}>
                <NotificationPopUp
                  title="Are you sure you want to delete this item?"
                  description="This action cannot be reversed."
                  isVisible={isVisible}
                  hide={hide}
                  primaryButton={{
                    label: "Delete item",
                    icon: <FontAwesomeIcon icon={faTrash} />,
                    handleClick: handleDelete,
                    layoutClassName: styles.confirmDeleteButton,
                  }}
                  secondaryButton={{
                    label: t("Cancel"),
                    icon: <FontAwesomeIcon icon={faClose} />,
                    handleClick: () => {},
                  }}
                  layoutClassName={styles.popup}
                />
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

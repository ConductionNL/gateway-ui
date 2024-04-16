import * as React from "react";
import * as styles from "./ConfirmPopUp.module.css";

import { NotificationPopUp as _NotificationPopUp } from "@conduction/components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import clsx from "clsx";

interface ConfirmPopUpProps {
  title: string;
  description: string;
  hide: () => void;
  isVisible: boolean;
  confirmButton: {
    variant: "primary" | "danger" | "success";
    label: string;
    icon: IconDefinition;
  };
  cancelButton: {
    href: string;
  };
  handleConfirm: () => any;
}

export const ConfirmPopUp: React.FC<ConfirmPopUpProps> = ({
  title,
  description,
  hide,
  isVisible,
  confirmButton,
  cancelButton,
  handleConfirm,
}) => {
  const NotificationPopUp = _NotificationPopUp.NotificationPopUp;

  if (!isVisible) return <></>;

  return (
    <div className={styles.overlay} onClick={(e) => e.stopPropagation()}>
      <NotificationPopUp
        primaryButton={{
          label: confirmButton.label,
          icon: <FontAwesomeIcon icon={confirmButton.icon} />,
          handleClick: handleConfirm,
          layoutClassName: clsx(styles.button, styles[confirmButton.variant]),
        }}
        secondaryButton={{
          label: "Cancel",
          icon: <FontAwesomeIcon icon={faClose} />,
          handleClick: () => {},
          href: cancelButton.href,
        }}
        layoutClassName={styles.popup}
        {...{ title, description, isVisible, hide }}
      />
    </div>
  );
};

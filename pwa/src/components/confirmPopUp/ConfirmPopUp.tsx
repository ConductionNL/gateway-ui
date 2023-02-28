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
  handleConfirm: () => any;
}

export const ConfirmPopUp: React.FC<ConfirmPopUpProps> = ({
  title,
  description,
  hide,
  isVisible,
  confirmButton,
  handleConfirm,
}) => {
  const NotificationPopUp = _NotificationPopUp.NotificationPopUp;

  if (!isVisible) return <></>;

  return (
    <div className={styles.overlay}>
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
        }}
        layoutClassName={styles.popup}
        {...{ title, description, isVisible, hide }}
      />
    </div>
  );
};

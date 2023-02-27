import * as React from "react";
import * as styles from "./ConfirmPopUp.module.css";

import { NotificationPopUp as _NotificationPopUp } from "@conduction/components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faTrash } from "@fortawesome/free-solid-svg-icons";
import clsx from "clsx";

interface ConfirmPopUpProps {
  title: string;
  description: string;
  hide: () => void;
  isVisible: boolean;
  variant: "primary" | "danger" | "success";
}

export const ConfirmPopUp: React.FC<ConfirmPopUpProps> = ({ title, description, hide, isVisible, variant }) => {
  const NotificationPopUp = _NotificationPopUp.NotificationPopUp;

  const handleDelete = () => undefined;

  if (!isVisible) return <></>;

  return (
    <div className={styles.overlay}>
      <NotificationPopUp
        title={title}
        description={description}
        isVisible={isVisible}
        hide={hide}
        primaryButton={{
          label: "Delete item", // Property worden
          icon: <FontAwesomeIcon icon={faTrash} />, // Icon moet een prop worden type = IconDefinition
          handleClick: handleDelete, // handle delete werkt nu niet
          layoutClassName: clsx(styles.button, styles[variant]),
        }}
        secondaryButton={{
          label: "Cancel",
          icon: <FontAwesomeIcon icon={faClose} />,
          handleClick: () => {},
        }}
        layoutClassName={styles.popup}
      />
    </div>
  );
};

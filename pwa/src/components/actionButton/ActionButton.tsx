import * as React from "react";
import * as styles from "./ActionButton.module.css";
import clsx from "clsx";

import { faCopy, faDownload, faEllipsisH, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Button } from "../button/Button";
import { NotificationPopUp } from "@conduction/components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import _ from "lodash";
import { ConfirmPopUp } from "../confirmPopUp/ConfirmPopUp";

type TAction = {
  type: "delete" | "download" | "duplicate" | "add";
  onSubmit: () => any;
  label?: string;
  disabled?: boolean;
};

interface ActionButtonProps {
  actions: TAction[];
  size?: "sm" | "md";
  layoutClassName?: string;
}

export const ActionButton: React.FC<ActionButtonProps> = ({ actions, size = "md", layoutClassName }) => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [action, setAction] = React.useState<() => any>(() => actions[0].onSubmit);
  const { isVisible, show, hide } = NotificationPopUp.controller();

  const handleActionClick = (e: React.MouseEvent<HTMLLIElement, MouseEvent>, action: TAction) => {
    e.stopPropagation();

    const { type, onSubmit } = action;

    if (type === "delete") {
      setAction(() => onSubmit);
      show();

      return;
    }

    onSubmit(); // submit any other type without confirming
  };

  const handleActionButtonClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.TouchEvent<HTMLButtonElement>,
  ) => {
    e.stopPropagation();
    setIsOpen((open) => !open);
  };

  return (
    <div className={clsx(styles.container, layoutClassName && layoutClassName)}>
      <Button
        variant="secondary"
        label={size !== "sm" ? "Actions" : ""}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        onClick={(e) => handleActionButtonClick(e)}
        icon={faEllipsisH}
        layoutClassName={styles[size]}
      />

      <div className={clsx(styles.actionsContainer, isOpen && styles.isOpen)}>
        <ul>
          {actions.map((action, idx) => (
            <li
              key={idx}
              onClick={(e) => handleActionClick(e, action)}
              className={clsx(action.disabled && styles.disabled, action.label && styles.buttonLabel)}
            >
              <FontAwesomeIcon icon={getIconFromBulkAction(action)} /> {_.upperFirst(action.label ?? action.type)}
            </li>
          ))}
        </ul>
      </div>

      <ConfirmPopUp
        title="Are you sure you want to delete this item?"
        description="Deletion of an item can not be reversed."
        confirmButton={{
          variant: "danger",
          label: "Delete",
          icon: faTrash,
        }}
        handleConfirm={action}
        {...{ isVisible, hide }}
      />
    </div>
  );
};

const getIconFromBulkAction = (action: TAction) => {
  const { type } = action;

  switch (type) {
    case "delete":
      return faTrash;
    case "download":
      return faDownload;
    case "duplicate":
      return faCopy;
    case "add":
      return faPlus;
  }
};

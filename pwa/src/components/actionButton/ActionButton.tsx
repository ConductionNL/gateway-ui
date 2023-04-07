import * as React from "react";
import * as styles from "./ActionButton.module.css";
import clsx from "clsx";

import { faCopy, faEllipsisH, faSave, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Button } from "../button/Button";
import { NotificationPopUp, ToolTip } from "@conduction/components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import _ from "lodash";
import { ConfirmPopUp } from "../confirmPopUp/ConfirmPopUp";

type TAction = {
  type: "delete" | "download" | "duplicate";
  onSubmit: () => any;
  disabled?: boolean;
};

interface ActionButtonProps {
  actions: TAction[];
  layoutClassName?: string;
}

export const ActionButton: React.FC<ActionButtonProps> = ({ actions, layoutClassName }) => {
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
        label="Actions"
        onBlur={() => setTimeout(() => setIsOpen(false), 100)}
        onClick={(e) => handleActionButtonClick(e)}
        icon={faEllipsisH}
      />

      <div className={clsx(styles.actionsContainer, isOpen && styles.isOpen)}>
        <ul>
          {actions.map((action, idx) => (
            <li key={idx} onClick={(e) => handleActionClick(e, action)} className={action.disabled && styles.disabled}>
              <FontAwesomeIcon icon={getIconFromBulkAction(action)} /> {_.upperFirst(action.type)}
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
      return faSave;
    case "duplicate":
      return faCopy;
  }
};

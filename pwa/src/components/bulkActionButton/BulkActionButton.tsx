import * as React from "react";
import * as styles from "./BulkActionButton.module.css";
import clsx from "clsx";

import { faEllipsisH, faSave, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Button } from "../button/Button";
import { NotificationPopUp, ToolTip } from "@conduction/components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import _ from "lodash";
import { ConfirmPopUp } from "../confirmPopUp/ConfirmPopUp";

type TBulkAction = {
  type: "delete" | "download";
  onSubmit: () => any;
};

interface BulkActionButtonProps {
  actions: TBulkAction[];
  selectedItemsCount: number;
  layoutClassName?: string;
}

export const BulkActionButton: React.FC<BulkActionButtonProps> = ({ actions, selectedItemsCount, layoutClassName }) => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [disabled, setDisabled] = React.useState<boolean>(!selectedItemsCount);
  const [action, setAction] = React.useState<() => any>(() => actions[0].onSubmit);
  const { isVisible, show, hide } = NotificationPopUp.controller();

  React.useEffect(() => setDisabled(!selectedItemsCount), [selectedItemsCount]);

  const handleActionClick = (action: TBulkAction) => {
    const { type, onSubmit } = action;

    if (type === "delete") {
      setAction(() => onSubmit);
      show();

      return;
    }

    onSubmit(); // submit any other type without confirming
  };

  return (
    <div className={clsx(styles.container, layoutClassName && layoutClassName)}>
      <ToolTip tooltip={disabled ? "Select one or more rows" : ""}>
        <Button
          variant="primary"
          label={
            <span className={styles.buttonContainer}>
              <span>Bulk actions</span>
              <span className={styles.amountIndicator}>{Math.min(selectedItemsCount, 99)}</span>
            </span>
          }
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          onClick={() => setIsOpen((isOpen) => !isOpen)}
          icon={faEllipsisH}
          {...{ disabled }}
        />
      </ToolTip>

      <div className={clsx(styles.actionsContainer, isOpen && styles.isOpen)}>
        <ul>
          {actions.map((action, idx) => (
            <li key={idx} onClick={() => handleActionClick(action)}>
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

const getIconFromBulkAction = (action: TBulkAction) => {
  const { type } = action;

  switch (type) {
    case "delete":
      return faTrash;
    case "download":
      return faSave;
  }
};

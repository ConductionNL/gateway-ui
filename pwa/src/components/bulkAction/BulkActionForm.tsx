import * as React from "react";
import * as styles from "./BulkActionForm.module.css";
import clsx from "clsx";

import { faEllipsisH, faSave, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Button } from "../button/Button";
import { ToolTip } from "@conduction/components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type TBulkAction = {
  label: "Delete" | "Download";
  onSubmit: () => any;
};

interface BulkActionFormProps {
  actions: TBulkAction[];
  selectedItemsCount: number;
}

export const BulkActionForm: React.FC<BulkActionFormProps> = ({ actions, selectedItemsCount }) => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [disabled, setDisabled] = React.useState<boolean>(!selectedItemsCount);

  React.useEffect(() => setDisabled(!selectedItemsCount), [selectedItemsCount]);

  return (
    <div className={styles.container}>
      <ToolTip tooltip={disabled ? "Select one or more rows" : ""}>
        <Button
          variant="primary"
          label={
            <span className={clsx(styles.buttonContainer, disabled && styles.disabled)}>
              <span className={styles.label}>Bulk actions</span>

              <span className={styles.amountIndicator}>{Math.min(selectedItemsCount, 99)}</span>
            </span>
          }
          onBlur={() => setTimeout(() => setIsOpen(false), 100)}
          onClick={() => setIsOpen((isOpen) => !isOpen)}
          icon={faEllipsisH}
          {...{ disabled }}
        />
      </ToolTip>

      <div className={clsx(styles.actionsContainer, isOpen && styles.isOpen)}>
        <ul>
          {actions.map((action, idx) => (
            <li key={idx} onClick={action.onSubmit}>
              <FontAwesomeIcon icon={getIconFromBulkAction(action)} /> {action.label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const getIconFromBulkAction = (action: TBulkAction) => {
  const { label } = action;

  switch (label) {
    case "Delete":
      return faTrash;
    case "Download":
      return faSave;
  }
};

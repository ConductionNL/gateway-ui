import * as React from "react";
import * as styles from "./DashboardCard.module.css";
import _ from "lodash";
import clsx from "clsx";
import { navigate } from "gatsby";
import { NotificationPopUp, ToolTip } from "@conduction/components";
import { faArrowRight, faBars, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Button } from "../button/Button";
import { getDashboardStatusTag } from "../../services/getStatusTag";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ConfirmPopUp } from "../confirmPopUp/ConfirmPopUp";

export type TDashboardCardTag = { label: string; tooltip: string };

export interface DashboardCardProps {
  title: {
    label: string;
    href: string;
  };
  type: string;
  tags: TDashboardCardTag[];
  onDelete: (e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.TouchEvent<HTMLButtonElement>) => void;
  isEnabled?: boolean;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({ title, type, tags, isEnabled, onDelete }) => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const { isVisible, show, hide } = NotificationPopUp.controller();

  return (
    <div className={styles.container}>
      <div className={styles.headerContainer}>
        <div>
          <span className={styles.title}>{title.label ? title.label : "-"}</span>

          <div className={clsx(styles.menuContainer)}>
            <div onBlur={() => setTimeout(() => setIsOpen(false), 150)} onClick={() => setIsOpen((isOpen) => !isOpen)}>
              <FontAwesomeIcon icon={faBars} />
            </div>

            <div className={clsx(styles.actionsContainer, isOpen && styles.isOpen)}>
              <ul>
                <li onClick={() => show()}>
                  <FontAwesomeIcon icon={faTrash} /> Remove
                </li>
              </ul>
            </div>
          </div>
        </div>
        <span className={styles.cardType}>{type}</span>
      </div>

      {!!tags.length && (
        <ul className={styles.tagsList}>
          {tags.map((tag, idx) => (
            <li key={idx}>
              <ToolTip tooltip={tag.tooltip}>{getDashboardStatusTag(tag.label)}</ToolTip>
            </li>
          ))}
        </ul>
      )}

      <div className={styles.buttonsContainer}>
        <Button variant="primary" icon={faArrowRight} label="Details" onClick={() => navigate(title.href)} />

        {isEnabled !== undefined && (
          <ToolTip tooltip={`Is enabled: ${isEnabled}`}>
            <span className={clsx(styles.enabledIndicator, isEnabled && styles.enabled)} />
          </ToolTip>
        )}
      </div>

      <ConfirmPopUp
        title="Are you sure you want to remove this card from your dashboard?"
        description="This can only be reversed on the detail page of the removed item."
        confirmButton={{
          variant: "danger",
          label: "Delete",
          icon: faTrash,
        }}
        //@ts-ignore
        handleConfirm={onDelete}
        {...{ isVisible, hide }}
      />
    </div>
  );
};

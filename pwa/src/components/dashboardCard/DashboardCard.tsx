import * as React from "react";
import * as styles from "./DashboardCard.module.css";
import _ from "lodash";
import clsx from "clsx";
import { navigate } from "gatsby";
import { Tag, ToolTip } from "@conduction/components";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { Button } from "../button/Button";
import { getStatusTag } from "../../services/getStatusTag";
import { ActionButton } from "../actionButton/ActionButton";

export type TDashboardCardTag = { label: string; tooltip: string };

export interface DashboardCardProps {
  title: {
    label: string;
    href: string;
  };
  type: string;
  tags: TDashboardCardTag[];
  onDelete: () => void;
  isEnabled?: boolean;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({ title, type, tags, isEnabled, onDelete }) => {
  return (
    <div className={styles.container}>
      <div className={styles.headerContainer}>
        <div className={styles.titleContainer}>
          <span className={styles.title}>{title.label ? title.label : "-"}</span>

          <div className={styles.typeContainer}>
            <span className={styles.typeLabel}>{type}</span>

            {isEnabled !== undefined && (
              <ToolTip tooltip={isEnabled ? "Enabled" : "Disabled"}>
                <span className={clsx(styles.enabledIndicator, isEnabled && styles.enabled)} />
              </ToolTip>
            )}
          </div>
        </div>

        <ActionButton actions={[{ type: "delete", onSubmit: onDelete }]} size="sm" variant="secondary" />
      </div>

      {!!tags.length && (
        <ul className={styles.tagsList}>
          {tags.map((tag, idx) => (
            <li key={idx}>
              <ToolTip tooltip={tag.tooltip}>
                {tag.tooltip === "Status" ? getStatusTag(tag.label) : <Tag label={tag.label} />}
              </ToolTip>
            </li>
          ))}
        </ul>
      )}

      <Button
        layoutClassName={styles.button}
        variant="primary"
        icon={faArrowRight}
        label="Details"
        onClick={() => navigate(title.href)}
      />
    </div>
  );
};

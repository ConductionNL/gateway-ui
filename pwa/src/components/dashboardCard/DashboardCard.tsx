import * as React from "react";
import * as styles from "./DashboardCard.module.css";
import _ from "lodash";
import clsx from "clsx";
import { navigate } from "gatsby";
import { Tag } from "@conduction/components";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { Button } from "../button/Button";
import { getStatusTag } from "../../services/getStatusTag";
import { ActionButton } from "../actionButton/ActionButton";
import { TOOLTIP_ID } from "../../layout/Layout";

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
              <span
                data-tooltip-id={TOOLTIP_ID}
                data-tooltip-content={isEnabled ? "Enabled" : "Disabled"}
                className={clsx(styles.enabledIndicator, isEnabled && styles.enabled)}
              />
            )}
          </div>
        </div>

        <ActionButton actions={[{ type: "delete", onSubmit: onDelete }]} size="sm" variant="secondary" />
      </div>

      {!!tags.length && (
        <ul className={styles.tagsList}>
          {tags.map((tag, idx) => (
            <li key={idx}>
              <div data-tooltip-id={TOOLTIP_ID} data-tooltip-content={tag.tooltip}>
                {tag.tooltip === "Status" ? (
                  getStatusTag(tag.label)
                ) : (
                  <Tag layoutClassName={styles.tag} label={tag.label} />
                )}
              </div>
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

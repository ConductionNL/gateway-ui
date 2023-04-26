import * as React from "react";
import * as styles from "./DashboardCard.module.css";
import _ from "lodash";
import clsx from "clsx";
import { navigate } from "gatsby";
import { Tag, ToolTip } from "@conduction/components";
import { faArrowRight, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Button } from "../button/Button";

export interface DashboardCardProps {
  title: {
    label: string;
    href: string;
  };
  type: string;
  tags: {
    label: string;
    tooltip: string;
  }[];
  onDelete: (e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.TouchEvent<HTMLButtonElement>) => void;
  isEnabled?: boolean;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({ title, type, tags, isEnabled, onDelete }) => {
  return (
    <div className={styles.container}>
      <div className={styles.headerContainer}>
        <div>
          <span>{title.label}</span>

          {isEnabled !== undefined && (
            <ToolTip tooltip="Is enabled">
              <span className={clsx(styles.enabledIndicator, isEnabled && styles.enabled)} />
            </ToolTip>
          )}
        </div>
        <span className={styles.cardType}>{type}</span>
      </div>

      <ul className={styles.tagsList}>
        {tags.map((tag, idx) => (
          <li key={idx}>
            <ToolTip tooltip={tag.tooltip}>
              <Tag label={tag.label} />
            </ToolTip>
          </li>
        ))}
      </ul>

      <div className={styles.buttonsContainer}>
        <Button variant="primary" icon={faArrowRight} label="Details" onClick={() => navigate(title.href)} />
        <Button variant="danger" icon={faTrash} label="Delete" onClick={onDelete} />
      </div>
    </div>
  );
};

{
  /* <div className={styles.container} onClick={() => navigate(title.href)}>
      <div className={styles.titleLink}>
        <Link icon={<FontAwesomeIcon icon={faArrowRight} />} iconAlign="start">
          {title.label}
        </Link>
      </div>

      <div>
        <Button className={styles.deleteButton} onClick={onDelete}>
          <FontAwesomeIcon icon={faTrash} />
          {t("Remove")}
        </Button>
      </div>

      <div className={styles.statusTypeContainer}>
        <div>{_.upperFirst(type)}</div>

        {getStatusTag(status)}
      </div>

      <div className={styles.sectionDivider}>
        <div className={styles.mainSection}>
          {lastRun && (
            <div className={styles.date}>
              <span className={styles.dateText}>Last run:</span> {dateTime(t(i18n.language), lastRun) ?? "-"}
            </div>
          )}
          {lastCall && (
            <div className={styles.date}>
              <span className={styles.dateText}>Last call:</span> {dateTime(t(i18n.language), lastCall) ?? "-"}
            </div>
          )}
        </div>

        <div>{isEnabled !== undefined && <span>Enabled: {isEnabled ? "On" : "Off"}</span>}</div>
      </div>
    </div> */
}

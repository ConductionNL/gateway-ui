import * as React from "react";
import * as styles from "./DashboardCard.module.css";
import { Button, Link } from "@gemeente-denhaag/components-react";
import { navigate } from "gatsby";
import _ from "lodash";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import { Tag, ToolTip } from "@conduction/components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getStatusColor, getStatusIcon } from "../../services/getStatusColorAndIcon";
import { dateTime } from "../../services/dateTime";
import { faArrowRight, faTrash } from "@fortawesome/free-solid-svg-icons";

export interface DashboardCardProps {
  title: {
    label: string;
    href: string;
  };
  type: string;
  tags: string[];
  isEnabled?: boolean; // true false undefined

  // status?: string | boolean;
  // lastRun?: string;
  // lastCall?: string;
  onDelete: (e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.TouchEvent<HTMLButtonElement>) => void;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({ title, type, tags, isEnabled, onDelete }) => {
  return (
    <div className={styles.container}>
      <div className={styles.headerContainer}>
        <span>{title.label}</span>
        <span className={styles.cardType}>{type}</span>

        <ToolTip tooltip="Is enabled">
          <span className={clsx(styles.enabledIndicator, isEnabled ? styles.enabled : styles.disabled)} />
        </ToolTip>
      </div>

      <ul className={styles.tagsList}>
        {tags.map((tag, idx) => (
          <li key={idx}>
            <Tag label={tag} />
          </li>
        ))}
      </ul>
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

        <div className={clsx(styles[getStatusColor(status ?? "no known status")])}>
          <ToolTip tooltip="Status">
            <Tag
              icon={<FontAwesomeIcon icon={getStatusIcon(status ?? "no known status")} />}
              label={status?.toString() ?? "no known status"}
            />
          </ToolTip>
        </div>
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

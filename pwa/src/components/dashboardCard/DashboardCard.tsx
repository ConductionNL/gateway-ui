import * as React from "react";
import * as styles from "./DashboardCard.module.css";
import { Link, Paragraph } from "@gemeente-denhaag/components-react";
import { navigate } from "gatsby";
import _ from "lodash";
import { ArrowRightIcon } from "@gemeente-denhaag/icons";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import { Tag, ToolTip } from "@conduction/components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getStatusColor, getStatusIcon } from "../../services/getStatusColorAndIcon";
import { dateTime } from "../../services/dateTime";

export interface DashboardCardProps {
  title: {
    label: string;
    href: string;
  };
  type: string;
  status?: string | boolean;
  lastRun?: string;
  lastCall?: string;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({ title, type, status, lastRun, lastCall }) => {
  const { t, i18n } = useTranslation();

  return (
    <div className={styles.container}>
      <div className={styles.titleLink} onClick={() => navigate(title.href)}>
        <Link icon={<ArrowRightIcon />} iconAlign="start">
          {title.label}
        </Link>
      </div>

      <Paragraph className={styles.statusTypeContainer}>
        <div>{type}</div>

        {status && (
          <div className={clsx(styles[getStatusColor(status)])}>
            <ToolTip tooltip="Status">
              <Tag icon={<FontAwesomeIcon icon={getStatusIcon(status)} />} label={status?.toString() ?? "-"} />
            </ToolTip>
          </div>
        )}
      </Paragraph>

      <div>
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
    </div>
  );
};

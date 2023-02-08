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
  isEnabled?: boolean | undefined;
  lastRun?: string;
  lastCall?: string;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({ title, type, status, isEnabled, lastRun, lastCall }) => {
  const { t, i18n } = useTranslation();

  return (
    <div className={styles.container} onClick={() => navigate(title.href)}>
      <div className={styles.titleLink}>
        <Link icon={<ArrowRightIcon />} iconAlign="start">
          {title.label}
        </Link>
      </div>

      <Paragraph className={styles.statusTypeContainer}>
        <div>{_.upperFirst(type)}</div>

        <div className={clsx(styles[getStatusColor(status ?? "no known status")])}>
          <ToolTip tooltip="Status">
            <Tag
              icon={<FontAwesomeIcon icon={getStatusIcon(status ?? "no known status")} />}
              label={status?.toString() ?? "no known status"}
            />
          </ToolTip>
        </div>
      </Paragraph>

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
    </div>
  );
};

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

export interface DashboardCardProps {
  title: {
    label: string;
    href: string;
  };
  type: string;
  status?: string | boolean;
  lastRun?: Date;
  lastCall?: Date;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({ title, type, status, lastRun, lastCall }) => {
  const { t } = useTranslation();

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
        {lastRun && <div>Last run | {lastRun ?? "-"}</div>}
        {lastCall && <div>Last call | {lastCall ?? "-"}</div>}
      </div>
    </div>
  );
};

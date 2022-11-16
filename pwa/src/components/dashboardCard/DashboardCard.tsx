import * as React from "react";
import * as styles from "./DashboardCard.module.css";
import { Link, Paragraph } from "@gemeente-denhaag/components-react";
import { navigate } from "gatsby";
import _ from "lodash";
import { ArrowRightIcon } from "@gemeente-denhaag/icons";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import { Tag } from "@conduction/components";

export interface DashboardCardProps {
  title: {
    label: string;
    href: string;
  };
  description: string;
  status?: boolean;
  lastRun?: Date;
  lastCall?: Date;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({ title, description, status, lastRun, lastCall }) => {
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      <div className={styles.titleLink} onClick={() => navigate(title.href)}>
        <Link icon={<ArrowRightIcon />} iconAlign="start">
          {title.label}
        </Link>
      </div>

      <Paragraph className={styles.description}>{description}</Paragraph>

      <div className={styles.status}>
        {status && (
          <div className={clsx(styles[status === true ? "statusOk" : "statusFailed"])}>
            <Tag label={status?.toString() ?? "-"} />
          </div>
        )}

        {lastRun && <div>Last run | {lastRun ?? "-"}</div>}
      </div>

      {lastCall && <div>Last call | {lastCall ?? "-"}</div>}
    </div>
  );
};

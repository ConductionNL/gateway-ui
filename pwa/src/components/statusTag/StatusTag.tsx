import * as React from "react";
import * as styles from "./StatusTag.module.css";

import clsx from "clsx";
import { Tag, ToolTip } from "@conduction/components";

export type TStatusTagType =
  | "success"
  | "debug"
  | "info"
  | "notice"
  | "warning"
  | "error"
  | "critical"
  | "alert"
  | "emergency"
  | "default";

interface StatusTagProps {
  label: string;
  type?: TStatusTagType;
  toolTipContent?: string;
}

export const StatusTag: React.FC<StatusTagProps> = ({ label, type = "default", toolTipContent = "" }) => {
  return (
    <ToolTip layoutClassName={styles.tooltip} tooltip={toolTipContent}>
      <Tag layoutClassName={clsx(styles.container, styles[type])} {...{ label }} />
    </ToolTip>
  );
};

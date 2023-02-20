import * as React from "react";
import * as styles from "./Tag.module.css";

import clsx from "clsx";
import { Tag as ConductionTag, ToolTip } from "@conduction/components";

interface TagProps {
  label: string;
  type?: "success" | "debug" | "info" | "notice" | "warning" | "error" | "critical" | "alert" | "emergency";
  toolTipContent?: string;
}

export const Tag: React.FC<TagProps> = ({ label, type = "default", toolTipContent = "" }) => {
  return (
    <ToolTip tooltip={toolTipContent}>
      <ConductionTag layoutClassName={clsx(styles.container, styles[type])} {...{ label }} />
    </ToolTip>
  );
};

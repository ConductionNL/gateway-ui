import * as React from "react";
import * as styles from "./PaginationLocationIndicatorComponent.module.css";
import clsx from "clsx";

interface PaginationLocationIndicatorComponentProps {
  total: number;
  offset: number;
  count: number;
  layoutClassName?: string;
}

export const PaginationLocationIndicatorComponent: React.FC<PaginationLocationIndicatorComponentProps> = ({
  total,
  offset,
  count,
  layoutClassName,
}) => {
  return (
    <span className={clsx(styles.content, layoutClassName && layoutClassName)}>
      {count === 1
        ? `${offset + count} van de ${total} resultaten.`
        : `${offset + 1} t/m ${offset + count} van de ${total} resultaten.`}
    </span>
  );
};

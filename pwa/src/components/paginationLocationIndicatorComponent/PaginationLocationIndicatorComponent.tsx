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
  layoutClassName,
  ...rest
}) => {
  return (
    <span className={clsx(styles.content, layoutClassName && layoutClassName)}>
      <PaginationLocationText {...rest} />
    </span>
  );
};

const PaginationLocationText: React.FC<PaginationLocationIndicatorComponentProps> = ({ total, offset, count }) => {
  let text = "";

  console.log({ total, offset, count });

  switch (count) {
    case 0:
      text = "Geen resultaten";
      break;
    case 1:
      text = `${offset + count} van de ${total} resultaten.`;
      break;
    default:
      text = `${offset + 1} t/m ${offset + count} van de ${total} resultaten.`;
      break;
  }

  return <>{text}</>;
};

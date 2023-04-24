import * as React from "react";
import * as styles from "./TotalResultsSpan.module.css";

interface TotalResultsSpanProps {
  total: string;
  offset: string;
  count: string;
}

export const TotalResultsSpan: React.FC<TotalResultsSpanProps> = ({ total, offset, count }) => {
  return (
    <span className={styles.content}>
      {offset} tot {(offset + count)} van de {total} resultaten.
    </span>
  );
};

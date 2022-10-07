import * as React from "react";
import * as styles from "./Layout.module.css";

interface UnauthenticatedLayoutProps {
  children: React.ReactNode;
}

export const UnauthenticatedLayout: React.FC<UnauthenticatedLayoutProps> = ({ children }) => (
  <div className={styles.pageContent}>{children}</div>
);

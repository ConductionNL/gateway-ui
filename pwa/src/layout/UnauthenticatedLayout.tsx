import * as React from "react";
import * as styles from "./Layout.module.css";
import Favicon from "react-favicon";
import { getTokenValue } from "../services/getTokenValue";
import { designTokenToUrl } from "../services/designTokenToUrl";

interface UnauthenticatedLayoutProps {
  children: React.ReactNode;
}

export const UnauthenticatedLayout: React.FC<UnauthenticatedLayoutProps> = ({ children }) => (
  <>
    <Favicon url={designTokenToUrl(getTokenValue(styles.favicon))} />
    <div className={styles.pageContent}>{children}</div>
  </>
);

import * as React from "react";
import * as styles from "./Layout.module.css";
import { UnauthenticatedFooterTemplate } from "../templates/templateParts/footer/FooterTemplate";
import { UnauthenticatedHeaderTemplate } from "../templates/templateParts/header/HeaderTemplate";

interface UnauthenticatedLayoutProps {
  children: React.ReactNode;
}

export const UnauthenticatedLayout: React.FC<UnauthenticatedLayoutProps> = ({ children }) => (
  <>
    <UnauthenticatedHeaderTemplate />
    <div className={styles.pageContent}>{children}</div>
    <UnauthenticatedFooterTemplate />
  </>
);

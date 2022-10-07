import * as React from "react";
import * as styles from "./Layout.module.css";
import { AuthenticatedFooterTemplate } from "../templates/templateParts/footer/FooterTemplate";
import { AuthenticatedHeaderTemplate } from "../templates/templateParts/header/HeaderTemplate";
import { PrivateRoute } from "@conduction/components";
import { isLoggedIn } from "../services/auth";

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

export const AuthenticatedLayout: React.FC<AuthenticatedLayoutProps> = ({ children }) => (
  <PrivateRoute authenticated={isLoggedIn()}>
    <AuthenticatedHeaderTemplate layoutClassName={styles.authenticatedHeader} />
    <div className={styles.pageContent}>{children}</div>
    <AuthenticatedFooterTemplate />
  </PrivateRoute>
);

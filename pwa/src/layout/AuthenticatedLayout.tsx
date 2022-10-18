import * as React from "react";
import * as styles from "./Layout.module.css";
import { PrivateRoute } from "@conduction/components";
import { isLoggedIn } from "../services/auth";
import Favicon from "react-favicon";
import { getTokenValue } from "../services/getTokenValue";
import { designTokenToUrl } from "../services/designTokenToUrl";

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

export const AuthenticatedLayout: React.FC<AuthenticatedLayoutProps> = ({ children }) => (
  <PrivateRoute authenticated={isLoggedIn()}>
    <Favicon url={designTokenToUrl(getTokenValue(styles.favicon))} />
    <div className={styles.pageContent}>{children}</div>
  </PrivateRoute>
);

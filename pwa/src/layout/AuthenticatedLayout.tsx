import * as React from "react";
import * as styles from "./Layout.module.css";
import { PrivateRoute } from "@conduction/components";
import { isLoggedIn } from "../services/auth";

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

export const AuthenticatedLayout: React.FC<AuthenticatedLayoutProps> = ({ children }) => (
  <PrivateRoute authenticated={isLoggedIn()}>
    <div className={styles.pageContent}>{children}</div>
  </PrivateRoute>
);

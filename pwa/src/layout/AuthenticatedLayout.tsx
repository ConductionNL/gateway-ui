import * as React from "react";
import * as styles from "./Layout.module.css";
import { PrivateRoute } from "@conduction/components";
import { useAuthentication } from "../hooks/useAuthentication";

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

export const AuthenticatedLayout: React.FC<AuthenticatedLayoutProps> = ({ children }) => {
  const { isLoggedIn } = useAuthentication();

  return (
    <PrivateRoute authenticated={isLoggedIn()}>
      <div className={styles.pageContent}>{children}</div>
    </PrivateRoute>
  );
};

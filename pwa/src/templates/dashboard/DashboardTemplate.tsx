import * as React from "react";
import * as styles from "./DashboardTemplate.module.css";
import { Container, PrivateRoute } from "@conduction/components";
import { isLoggedIn } from "../../services/auth";
import { Sidebar } from "../sidebar/Sidebar";

export const DashboardTemplate: React.FC = ({ children }) => {
  return (
    <PrivateRoute authenticated={isLoggedIn()}>
      <Container layoutClassName={styles.container}>
        <Sidebar layoutClassName={styles.sidebar} />

        <div className={styles.content}>{children}</div>
      </Container>
    </PrivateRoute>
  );
};

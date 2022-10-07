import * as React from "react";
import * as styles from "./DashboardTemplate.module.css";
import { Breadcrumbs, Container, PrivateRoute } from "@conduction/components";
import { isLoggedIn } from "../../services/auth";
import { Sidebar } from "../sidebar/Sidebar";
import { GatsbyContext } from "../../context/gatsby";
import { useTranslation } from "react-i18next";
import _ from "lodash";

export const DashboardTemplate: React.FC = ({ children }) => {
  const { t } = useTranslation();

  const {
    pageContext: {
      breadcrumb: { crumbs },
    },
  } = React.useContext(GatsbyContext);

  const translatedCrumbs = crumbs.map((crumb: any) => ({ ...crumb, crumbLabel: _.upperFirst(crumb.crumbLabel) }));

  return (
    <PrivateRoute authenticated={isLoggedIn()}>
      <Container layoutClassName={styles.container}>
        <Sidebar layoutClassName={styles.sidebar} />

        <div className={styles.content}>
          <Breadcrumbs crumbs={translatedCrumbs} />

          {children}
        </div>
      </Container>
    </PrivateRoute>
  );
};

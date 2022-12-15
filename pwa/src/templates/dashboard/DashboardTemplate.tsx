import * as React from "react";
import * as styles from "./DashboardTemplate.module.css";
import { Breadcrumbs, Container, PrivateRoute } from "@conduction/components";
import { isLoggedIn } from "../../services/auth";
import { Sidebar } from "../sidebar/Sidebar";
import { GatsbyContext } from "../../context/gatsby";
import _ from "lodash";
import { Topbar } from "../topbar/Topbar";

export const DashboardTemplate: React.FC = ({ children }) => {
  const {
    pageContext: {
      breadcrumb: { crumbs },
    },
    location: { pathname },
    screenSize,
  } = React.useContext(GatsbyContext);

  const translatedCrumbs = crumbs.map((crumb: any, idx: any) => {
    const cutPathname = pathname.substring(0, pathname.lastIndexOf("/"));
    const crumbPathname = idx === 2 ? cutPathname : crumb.pathname;

    return { ...crumb, crumbLabel: _.upperFirst(crumb.crumbLabel), pathname: crumbPathname };
  });

  return (
    <PrivateRoute authenticated={isLoggedIn()}>
      <Container layoutClassName={styles.container}>
        {screenSize !== "mobile" && <Sidebar layoutClassName={styles.sidebar} />}
        {screenSize === "mobile" && <Topbar />}

        <div className={styles.content}>
          <Breadcrumbs crumbs={translatedCrumbs} />

          {children}
        </div>
      </Container>
    </PrivateRoute>
  );
};

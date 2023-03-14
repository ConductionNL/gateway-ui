import * as React from "react";
import * as styles from "./DashboardTemplate.module.css";
import { Breadcrumbs, Container, PrivateRoute } from "@conduction/components";
import { Sidebar } from "../sidebar/Sidebar";
import _ from "lodash";
import { Topbar } from "../topbar/Topbar";
import { useGatsbyContext } from "../../context/gatsby";
import { useAuthentication } from "../../hooks/useAuthentication";

export const DashboardTemplate: React.FC = ({ children }) => {
  const { isLoggedIn } = useAuthentication();
  const { gatsbyContext } = useGatsbyContext();
  const [translatedCrumbs, setTranslatedCrumbs] = React.useState<any>(null);

  React.useEffect(() => {
    if (!gatsbyContext) return;

    const {
      pageContext: {
        breadcrumb: { crumbs },
      },
      location: { pathname },
    } = gatsbyContext;

    setTranslatedCrumbs(
      crumbs.map((crumb: any, idx: any) => {
        const cutPathname = pathname.substring(0, pathname.lastIndexOf("/"));
        const crumbPathname = idx === 2 ? cutPathname : crumb.pathname;

        return { ...crumb, crumbLabel: _.upperFirst(crumb.crumbLabel), pathname: crumbPathname };
      }),
    );
  }, [gatsbyContext]);

  return (
    <PrivateRoute authenticated={isLoggedIn()}>
      <Container layoutClassName={styles.container}>
        {gatsbyContext?.screenSize !== "mobile" && <Sidebar layoutClassName={styles.sidebar} />}
        {gatsbyContext?.screenSize === "mobile" && <Topbar />}

        <div className={styles.content}>
          <Breadcrumbs crumbs={translatedCrumbs} />

          {children}
        </div>
      </Container>
    </PrivateRoute>
  );
};

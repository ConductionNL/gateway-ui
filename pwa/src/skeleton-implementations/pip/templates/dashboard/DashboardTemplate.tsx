import * as React from "react";
import * as styles from "./DashboardTemplate.module.css";
import { GridIcon } from "@gemeente-denhaag/icons";
import { Sidenav, SidenavItem, SidenavLink, SidenavList } from "@gemeente-denhaag/sidenav";
import { GatsbyContext } from "../../context/gatsby";
import { navigate } from "gatsby";
import { useTranslation } from "react-i18next";
import { Container, Breadcrumbs, PrivateRoute } from "@conduction/components";
import { isLoggedIn } from "../../services/auth";
import { OpengemeentenIconHuis } from "@opengemeenten/iconset-react";

export const DashboardTemplate: React.FC = ({ children }) => {
  const { t } = useTranslation();

  const {
    pageContext: {
      breadcrumb: { crumbs },
    },
  } = React.useContext(GatsbyContext);

  const translatedCrumbs = crumbs.map((crumb: any) => ({ ...crumb, crumbLabel: t(crumb.crumbLabel) }));

  return (
    <PrivateRoute authenticated={isLoggedIn()}>
      <Container>
        <div className={styles.container}>
          <div className={styles.menu}>
            <Menu />
          </div>

          <div className={styles.content}>
            <Breadcrumbs crumbs={translatedCrumbs} />
            {children}
          </div>
        </div>
      </Container>
    </PrivateRoute>
  );
};

/**
 * Local side navigation menu component
 */

interface MenuItem {
  label: string;
  href: string;
  icon: JSX.Element;
  current?: boolean;
}

const Menu: React.FC = () => {
  const { t } = useTranslation();
  const {
    location: { pathname },
  } = React.useContext(GatsbyContext);

  const menuItems: MenuItem[] = [
    {
      label: t("Home"),
      href: "/",
      current: pathname === "/",
      icon: <OpengemeentenIconHuis className={styles.icons} />,
    },
  ];

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, href: string): void => {
    e.preventDefault();
    navigate(href);
  };

  return (
    <Sidenav>
      <SidenavList>
        {menuItems.map(({ href, label, icon, current }) => (
          <SidenavItem key={href}>
            <SidenavLink href="" onClick={(e) => handleClick(e, href)} current={current}>
              {icon}
              {label}
            </SidenavLink>
          </SidenavItem>
        ))}
      </SidenavList>
    </Sidenav>
  );
};

import * as React from "react";
import * as styles from "./Sidebar.module.css";
import clsx from "clsx";
import { VerticalMenu } from "../templateParts/verticalMenu/VerticalMenu";
import { navigate } from "gatsby";
import Logo from "./../../assets/svgs/conduction-logo.svg";
import { bottomMenuItems, mainMenuItems } from "../../data/navMenuItems";

interface SidebarProps {
  layoutClassName?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ layoutClassName }) => {
  return (
    <div className={clsx(styles.container, [layoutClassName && layoutClassName])}>
      <section className={styles.topMenu}>
        <div className={styles.logoContainer}>
          <img className={styles.logo} src={Logo} alt="Conduction" title="Conduction" onClick={() => navigate("/")} />
        </div>

        <hr className={styles.divider} />

        <VerticalMenu items={mainMenuItems()} />
      </section>

      <hr className={styles.divider} />

      <VerticalMenu items={bottomMenuItems()} />
    </div>
  );
};

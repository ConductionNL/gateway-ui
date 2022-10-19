import * as React from "react";
import * as styles from "./Sidebar.module.css";
import clsx from "clsx";
import { IMenuItem, VerticalMenu } from "../templateParts/verticalMenu/VerticalMenu";
import { navigate } from "gatsby";
import { GatsbyContext } from "../../context/gatsby";
import { handleLogout } from "../../services/auth";
import APIContext from "../../apiService/apiContext";
import APIService from "../../apiService/apiService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRightFromBracket,
  faGear,
  faGrip,
  faHome,
  faHourglass,
  faPlay,
} from "@fortawesome/free-solid-svg-icons";
import Logo from "./../../assets/svgs/conduction-logo.svg";

interface SidebarProps {
  layoutClassName?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ layoutClassName }) => {
  const API: APIService | null = React.useContext(APIContext);
  const {
    location: { pathname },
  } = React.useContext(GatsbyContext);

  const mainMenuItems: IMenuItem[] = [
    {
      label: "Dashboard",
      icon: <FontAwesomeIcon icon={faHome} />,
      onClick: () => navigate("/"),
      current: pathname === "/",
    },
    {
      label: "Actions",
      icon: <FontAwesomeIcon icon={faPlay} />,
      onClick: () => navigate("/actions"),
      current: pathname.includes("/actions"),
    },
    {
      label: "Sources",
      icon: <FontAwesomeIcon icon={faGrip} />,
      onClick: () => navigate("/sources"),
      current: pathname.includes("/sources"),
    },
    {
      label: "Cronjobs",
      icon: <FontAwesomeIcon icon={faHourglass} />,
      onClick: () => navigate("/cronjobs"),
      current: pathname.includes("/cronjobs"),
    },
  ];

  const bottomMenuItems: IMenuItem[] = [
    {
      label: "Settings",
      icon: <FontAwesomeIcon icon={faGear} />,
      onClick: () => navigate("/settings"),
      current: pathname === "/settings",
    },
    {
      label: "Logout",
      icon: <FontAwesomeIcon icon={faArrowRightFromBracket} />,
      onClick: () => handleLogout(API),
      current: false,
    },
  ];

  return (
    <div className={clsx(styles.container, [layoutClassName && layoutClassName])}>
      <section className={styles.topMenu}>
        <div className={styles.imageContainer}>
          <img src={Logo} alt="Conduction" title="Conduction" onClick={() => navigate("/")} />
        </div>

        <VerticalMenu layoutClassName={styles.menu} items={mainMenuItems} />
      </section>

      <VerticalMenu layoutClassName={styles.menu} items={bottomMenuItems} />
    </div>
  );
};

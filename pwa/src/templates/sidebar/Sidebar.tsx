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
  faClipboardList,
  faDiagramProject,
  faDatabase,
  faGear,
  faGrip,
  faHome,
  faHourglass,
  faList,
  faLocationDot,
  faPlay,
  faPuzzlePiece,
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
    {
      label: "Endpoints",
      icon: <FontAwesomeIcon icon={faLocationDot} />,
      onClick: () => navigate("/endpoints"),
      current: pathname.includes("/endpoints"),
    },
    {
      label: "Data layer",
      icon: <FontAwesomeIcon icon={faDatabase} />,
      onClick: () => navigate("/objects"),
      current: pathname.includes("/objects"),
    },
    {
      label: "Schemas",
      icon: <FontAwesomeIcon icon={faClipboardList} />,
      onClick: () => navigate("/schemes"),
      current: pathname.includes("/schemes"),
    },
    {
      label: "Logs",
      icon: <FontAwesomeIcon icon={faList} />,
      onClick: () => navigate("/logs"),
      current: pathname.includes("/logs"),
    },
    {
      label: "Plugins",
      icon: <FontAwesomeIcon icon={faPuzzlePiece} />,
      onClick: () => navigate("/plugins"),
      current: pathname.includes("/plugins"),
    },
    {
      label: "Collections",
      icon: <FontAwesomeIcon icon={faDiagramProject} />,
      onClick: () => navigate("/collections"),
      current: pathname.includes("/collections"),
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

        <VerticalMenu items={mainMenuItems} />
      </section>

      <VerticalMenu items={bottomMenuItems} />
    </div>
  );
};

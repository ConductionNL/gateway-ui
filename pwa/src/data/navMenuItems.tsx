import {
  faArrowRightFromBracket,
  faClipboardList,
  faDatabase,
  faDiagramProject,
  faGear,
  faGrip,
  faHome,
  faHourglass,
  faList,
  faLocationDot,
  faPlay,
  faPuzzlePiece,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { navigate } from "gatsby";
import React from "react";
import APIContext from "../apiService/apiContext";
import APIService from "../apiService/apiService";
import { useGatsbyContext } from "../context/gatsby";
import { handleLogout } from "../services/auth";

export const mainMenuItems = () => {
  const { gatsbyContext } = useGatsbyContext();

  const {
    location: { pathname },
  } = gatsbyContext;

  return [
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
      label: "Objects",
      icon: <FontAwesomeIcon icon={faDatabase} />,
      onClick: () => navigate("/objects"),
      current: pathname.includes("/objects"),
    },
    {
      label: "Schemas",
      icon: <FontAwesomeIcon icon={faClipboardList} />,
      onClick: () => navigate("/schemas"),
      current: pathname.includes("/schemas"),
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
};

export const bottomMenuItems = () => {
  const API: APIService | null = React.useContext(APIContext);
  const { gatsbyContext } = useGatsbyContext();

  const {
    location: { pathname },
  } = gatsbyContext;

  return [
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
};

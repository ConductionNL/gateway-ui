import {
  faArrowRightFromBracket,
  faClipboardList,
  faCloudUpload,
  faDatabase,
  faDiagramProject,
  faFile,
  faGear,
  faGrip,
  faHome,
  faHourglass,
  faList,
  faLocationDot,
  faMap,
  faPlay,
  faPuzzlePiece,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { navigate } from "gatsby";
import React from "react";
import { useGatsbyContext } from "../context/gatsby";
import { useAuthentication } from "../hooks/useAuthentication";

export const mainMenuItems = () => {
  const { gatsbyContext } = useGatsbyContext();
  const [pathname, setPathname] = React.useState<string>("");

  React.useEffect(() => {
    if (!gatsbyContext) return;

    setPathname(gatsbyContext.location.pathname);
  }, [gatsbyContext]);

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
    {
      label: "Mappings",
      icon: <FontAwesomeIcon icon={faMap} />,
      onClick: () => navigate("/mappings"),
      current: pathname.includes("/mappings"),
    },
    {
      label: "Templates",
      icon: <FontAwesomeIcon icon={faFile} />,
      onClick: () => navigate("/templates"),
      current: pathname.includes("/templates"),
    },
    {
      label: "Logs",
      icon: <FontAwesomeIcon icon={faList} />,
      onClick: () => navigate("/logs"),
      current: pathname.includes("/logs"),
    },
  ];
};

export const bottomMenuItems = () => {
  const { gatsbyContext } = useGatsbyContext();
  const [pathname, setPathname] = React.useState<string>("");
  const { handleLogout } = useAuthentication();

  React.useEffect(() => {
    if (!gatsbyContext) return;

    setPathname(gatsbyContext.location.pathname);
  }, [gatsbyContext]);

  return [
    {
      label: "Import and upload",
      icon: <FontAwesomeIcon icon={faCloudUpload} />,
      onClick: () => navigate("/upload"),
      current: pathname === "/upload",
    },
    {
      label: "Settings",
      icon: <FontAwesomeIcon icon={faGear} />,
      onClick: () => navigate("/settings"),
      current: pathname === "/settings",
    },
    {
      label: "Logout",
      icon: <FontAwesomeIcon icon={faArrowRightFromBracket} />,
      onClick: () => handleLogout(),
      current: false,
    },
  ];
};

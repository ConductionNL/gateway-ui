import * as React from "react";
import * as styles from "./Topbar.module.css";
import clsx from "clsx";
import { VerticalMenu } from "../templateParts/verticalMenu/VerticalMenu";
import { navigate } from "gatsby";
import Logo from "./../../assets/svgs/conduction-logo.svg";
import { bottomMenuItems, mainMenuItems } from "../../data/navMenuItems";
import Collapsible from "react-collapsible";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

interface TopbarProps {
  layoutClassName?: string;
}

export const Topbar: React.FC<TopbarProps> = ({ layoutClassName }) => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  return (
    <>
      <div className={clsx(styles.container, [layoutClassName && layoutClassName])}>
        <Collapsible
          trigger={
            <div className={styles.topnav}>
              <div className={styles.logoContainer}>
                <img
                  className={styles.logo}
                  src={Logo}
                  alt="Conduction"
                  title="Conduction"
                  onClick={() => navigate("/")}
                />
              </div>
              <div>
                <FontAwesomeIcon icon={faBars} />
              </div>
            </div>
          }
          open={isOpen}
          transitionTime={200}
          onOpening={() => setIsOpen(true)}
          onClosing={() => setIsOpen(false)}
        >
          <section className={styles.topMenu}>
            <VerticalMenu items={mainMenuItems()} />
          </section>

          <VerticalMenu items={bottomMenuItems()} />
        </Collapsible>
      </div>
    </>
  );
};

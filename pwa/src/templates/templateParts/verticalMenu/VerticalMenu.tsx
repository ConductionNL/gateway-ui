import React from "react";
import * as styles from "./VerticalMenu.module.css";
import clsx from "clsx";
import { navigate } from "gatsby";
import { GatsbyContext } from "../../../context/gatsby";
import { Sidenav, SidenavList, SidenavItem, SidenavLink } from "@gemeente-denhaag/sidenav";

export interface IMenuItem {
  label: string;
  icon: JSX.Element;
  current: boolean;
  onClick: () => any;
}

interface VerticalMenuProps {
  items: IMenuItem[];
  layoutClassName?: string;
}

export const VerticalMenu: React.FC<VerticalMenuProps> = ({ items, layoutClassName }) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, onClick: () => any): void => {
    e.preventDefault();

    onClick();
  };

  return (
    <div className={clsx(styles.container, [layoutClassName && layoutClassName])}>
      <Sidenav>
        <SidenavList>
          {items.map(({ onClick, label, icon, current }, idx) => (
            <SidenavItem key={idx}>
              <SidenavLink href="" onClick={(e) => handleClick(e, onClick)} {...{ current }}>
                <span className={styles.icon}>{icon}</span>

                {label}
              </SidenavLink>
            </SidenavItem>
          ))}
        </SidenavList>
      </Sidenav>
    </div>
  );
};

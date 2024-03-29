import React from "react";
import * as styles from "./VerticalMenu.module.css";
import { Sidenav, SidenavList, SidenavItem, SidenavLink } from "@gemeente-denhaag/sidenav";
import clsx from "clsx";

export interface IMenuItem {
  label: string;
  icon?: JSX.Element;
  current: boolean;
  onClick: () => any;
  subItems?: {
    label: string;
    icon: JSX.Element;
    current: boolean;
    onClick: () => any;
  }[];
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
    <div className={layoutClassName && layoutClassName}>
      <Sidenav>
        <SidenavList>
          {items.map(({ onClick, label, icon, current, subItems }, idx) => (
            <SidenavItem className={clsx([subItems && styles.hasSubitems])} key={idx}>
              <SidenavLink href="" onClick={(e) => handleClick(e, onClick)} {...{ current }}>
                {icon && <span className={styles.icon}>{icon}</span>}

                {label}
              </SidenavLink>
              {subItems &&
                subItems.map(({ onClick, label, icon, current }, idx) => (
                  <SidenavList className={styles.subItem} key={idx}>
                    <SidenavItem key={idx}>
                      <SidenavLink href="" onClick={(e) => handleClick(e, onClick)} {...{ current }}>
                        {icon && <span className={styles.icon}>{icon}</span>}

                        {label}
                      </SidenavLink>
                    </SidenavItem>
                  </SidenavList>
                ))}
            </SidenavItem>
          ))}
        </SidenavList>
      </Sidenav>
    </div>
  );
};

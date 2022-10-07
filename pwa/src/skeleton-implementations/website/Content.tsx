import * as React from "react";
import * as styles from "./Content.module.css";
import { FooterTemplate } from "./templates/templateParts/footer/FooterTemplate";
import { HeaderTemplate } from "./templates/templateParts/header/HeaderTemplate";

interface ContentProps {
  children: React.ReactNode;
}

export const Content: React.FC<ContentProps> = ({ children }) => {
  return (
    <>
      <HeaderTemplate />
      <div className={styles.pageContent}>{children}</div>
      <FooterTemplate />
    </>
  );
};

import { Heading1 } from "@gemeente-denhaag/components-react";
import * as React from "react";
import * as styles from "./OverviewPageHeaderTemplate.module.css";

interface OverviewPageHeaderTemplateProps {
  title: string;
  button: JSX.Element;
}

export const OverviewPageHeaderTemplate: React.FC<OverviewPageHeaderTemplateProps> = ({ title, button }) => {
  return (
    <div className={styles.container}>
      <Heading1>{title}</Heading1>

      {button}
    </div>
  );
};

import { Heading1, Heading2 } from "@gemeente-denhaag/components-react";
import * as React from "react";
import * as styles from "./OverviewPageHeaderTemplate.module.css";

interface OverviewPageHeaderTemplateProps {
  title: string;
  button: JSX.Element;

  size?: "lg" | "md"; // defaults to "lg"
}

export const OverviewPageHeaderTemplate: React.FC<OverviewPageHeaderTemplateProps> = ({
  title,
  button,
  size = "lg",
}) => {
  return (
    <div className={styles.container}>
      {size === "lg" && <Heading1>{title}</Heading1>}
      {size === "md" && <Heading2>{title}</Heading2>}

      {button}
    </div>
  );
};

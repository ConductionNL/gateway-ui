import * as React from "react";
import * as styles from "./ApplicationTemplate.module.css";
import { Heading1 } from "@gemeente-denhaag/components-react";

interface CreateApplicationTemplateProps {}

export const CreateApplicationTemplate: React.FC<CreateApplicationTemplateProps> = ({}) => {
  return (
    <div className={styles.container}>
      <section className={styles.section}>
        <Heading1>{"Create Application"}</Heading1>
      </section>
    </div>
  );
};

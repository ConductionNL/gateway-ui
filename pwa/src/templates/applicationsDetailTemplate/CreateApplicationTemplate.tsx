import * as React from "react";
import * as styles from "./ApplicationTemplate.module.css";
import { Heading1 } from "@gemeente-denhaag/components-react";
import { ApplicationsFormTemplate } from "../templateParts/applicationsForm/ApplicationsFormTemplate";

interface CreateApplicationTemplateProps {}

export const CreateApplicationTemplate: React.FC<CreateApplicationTemplateProps> = ({}) => {
  return (
    <div className={styles.container}>
      <section className={styles.section}>
        <Heading1>{"Create Application"}</Heading1>
        <ApplicationsFormTemplate />
      </section>
    </div>
  );
};

import * as React from "react";
import * as styles from "./UploadTemplate.module.css";
import { Container } from "@conduction/components";
import { Heading1 } from "@gemeente-denhaag/components-react";

export const UploadTemplate: React.FC = () => {
  return (
    <Container layoutClassName={styles.container}>
      <Heading1 className={styles.title}>Upload and import</Heading1>
    </Container>
  );
};

import * as React from "react";
import * as styles from "./FooterTemplate.module.css";
import { Container } from "@conduction/components";

export const FooterTemplate: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <Container>Footer content</Container>
    </footer>
  );
};

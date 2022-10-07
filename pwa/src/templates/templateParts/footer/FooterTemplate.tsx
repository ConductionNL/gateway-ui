import * as React from "react";
import * as styles from "./FooterTemplate.module.css";
import { List, ListItem, ListSubheader } from "@gemeente-denhaag/list";
import { navigate } from "gatsby";
import AuthenticatedDividerImage from "./../../../assets/images/AuthenticatedDivider.png";
import UnauthenticatedDividerImage from "./../../../assets/images/UnauthenticatedFooterDivider.png";
import { useTranslation } from "react-i18next";
import { Container, ImageDivider } from "@conduction/components";

export const AuthenticatedFooterTemplate: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className={styles.authenticated}>
      <ImageDivider image={AuthenticatedDividerImage} layoutClassName={styles.authenticatedImageDivider} />
      <Container>
        <div className={styles.inner}>
          <List>
            <ListSubheader className={styles.subHeader}>{t("Footer content")}</ListSubheader>
            <ListItem
              className={styles.listItem}
              primaryText={t("Link")}
              actionType="nav"
              onClick={() => navigate("#")}
            />
          </List>
        </div>
      </Container>
    </footer>
  );
};

export const UnauthenticatedFooterTemplate: React.FC = () => {
  return (
    <footer className={styles.unauthenticated}>
      <ImageDivider image={UnauthenticatedDividerImage} layoutClassName={styles.unauthenticatedImageDivider} />
    </footer>
  );
};

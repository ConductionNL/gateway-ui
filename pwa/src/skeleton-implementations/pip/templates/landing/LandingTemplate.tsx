import * as React from "react";
import { Heading3, Paragraph } from "@gemeente-denhaag/components-react";
import * as styles from "./LandingTemplate.module.css";
import { t } from "i18next";
import { UserIcon } from "@gemeente-denhaag/icons";
import DigidImage from "../../assets/svgs/digid.svg";
import { useDigiD } from "../../hooks/useDigiD";

import { Container, HorizontalImageCard } from "@conduction/components";

export const LandingTemplate: React.FC = () => {
  return (
    <Container>
      <div className={styles.container}>
        <div>
          <Heading3>{t("Login")}</Heading3>
          <Paragraph>Donec sed odio dui. Etiam porta sem malesuada magna mollis euismod.</Paragraph>
        </div>
        <div className={styles.loginCards}>
          <HorizontalImageCard
            iconOrImage={<img src={DigidImage} />}
            title={t("Login")}
            link={{
              href: useDigiD().getRedirectURL() ?? "",
              label: t("Login with DigiD"),
            }}
            external
          />
          <HorizontalImageCard
            iconOrImage={<UserIcon />}
            title={t("Login")}
            link={{
              href: "/login",
              label: t("Login with your account"),
            }}
          />
        </div>
      </div>
    </Container>
  );
};

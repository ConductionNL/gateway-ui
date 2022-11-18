import * as React from "react";
import * as styles from "./SettingsTemplate.module.css";
import { Heading1, Tab, TabContext, TabPanel, Tabs } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { Container } from "@conduction/components";
import { UserGroupsTemplate } from "../userGroupsTemplate/UserGroupsTemplate";
import { GatewayDetailTemplate } from "../gatewayDetailTemplate/GatewayDetailTemplate";

export const SettingsTemplate: React.FC = () => {
  const { t } = useTranslation();
  const [currentTab, setCurrentTab] = React.useState<number>(0);

  return (
    <Container layoutClassName={styles.container}>
      <Heading1>{t("Settings")}</Heading1>

      <div className={styles.tabContainer}>
        <TabContext value={currentTab.toString()}>
          <Tabs
            value={currentTab}
            onChange={(_, newValue: number) => {
              setCurrentTab(newValue);
            }}
            variant="scrollable"
          >
            <Tab className={styles.tab} label={t("Gateway Detail")} value={0} />
            <Tab className={styles.tab} label={t("User Groups")} value={1} />
          </Tabs>

          <TabPanel className={styles.tabPanel} value="0">
            <GatewayDetailTemplate />
          </TabPanel>
          <TabPanel className={styles.tabPanel} value="1">
            <UserGroupsTemplate />
          </TabPanel>
        </TabContext>
      </div>
    </Container>
  );
};

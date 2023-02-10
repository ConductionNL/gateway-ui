import * as React from "react";
import * as styles from "./SettingsTemplate.module.css";
import { Heading1, Tab, TabContext, TabPanel, Tabs } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { Container } from "@conduction/components";
import { SecurityGroupsTemplate } from "../securityGroupsTemplate/SecurityGroupsTemplate";
import { GatewayDetailTemplate } from "../gatewayDetailTemplate/GatewayDetailTemplate";
import { useCurrentTabContext } from "../../context/tabs";
import { ApplicationsTemplate } from "../applicationsTemplate/ApplicationsTemplate";
import { OrganizationsTemplate } from "../organizationsTemplate/OrganizationsTemplate";
import { UsersTemplate } from "../usersTemplate/UsersTemplate";
import { AuthenticationsTemplate } from "../authenticationsTemplate/AuthenticationsTemplate";

export const SettingsTemplate: React.FC = () => {
  const { t } = useTranslation();
  const { currentTabs, setCurrentTabs } = useCurrentTabContext();

  return (
    <Container layoutClassName={styles.container}>
      <Heading1>{t("Settings")}</Heading1>

      <div className={styles.tabContainer}>
        <TabContext value={currentTabs.settingsDetailTabs.toString()}>
          <Tabs
            value={currentTabs.settingsDetailTabs}
            onChange={(_, newValue: number) => {
              setCurrentTabs({ ...currentTabs, settingsDetailTabs: newValue });
            }}
            variant="scrollable"
          >
            <Tab className={styles.tab} label={t("Gateway Detail")} value={0} />
            <Tab className={styles.tab} label={t("Security Groups")} value={1} />
            <Tab className={styles.tab} label={t("Applications")} value={2} />
            <Tab className={styles.tab} label={t("Users")} value={3} />
            <Tab className={styles.tab} label={t("Organizations")} value={4} />
            <Tab className={styles.tab} label={t("Authentication Provider")} value={5} />
          </Tabs>

          <TabPanel className={styles.tabPanel} value="0">
            <GatewayDetailTemplate />
          </TabPanel>
          <TabPanel className={styles.tabPanel} value="1">
            <SecurityGroupsTemplate />
          </TabPanel>
          <TabPanel className={styles.tabPanel} value="2">
            <ApplicationsTemplate />
          </TabPanel>
          <TabPanel className={styles.tabPanel} value="3">
            <UsersTemplate />
          </TabPanel>
          <TabPanel className={styles.tabPanel} value="4">
            <OrganizationsTemplate />
          </TabPanel>
          <TabPanel className={styles.tabPanel} value="5">
            <AuthenticationsTemplate />
          </TabPanel>
        </TabContext>
      </div>
    </Container>
  );
};

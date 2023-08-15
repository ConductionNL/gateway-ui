import * as React from "react";
import * as styles from "./UploadTemplate.module.css";
import { Container } from "@conduction/components";
import { Alert, Heading1, Tab, TabContext, TabPanel, Tabs } from "@gemeente-denhaag/components-react";
import { t } from "i18next";
import { UploadResourceActionsTemplate } from "../templateParts/uploadResourceActions/UploadResourceActionsTemplate";
import { ImportResourceActionsTemplate } from "../templateParts/importResourceActions/ImportResourceActionsTemplate";

export const UploadTemplate: React.FC = () => {
  const [currentTab, setCurrentTab] = React.useState<number>(0);

  return (
    <Container layoutClassName={styles.container}>
      <Heading1>Import and upload</Heading1>

      <div className={styles.tabsContainer}>
        <TabContext value={currentTab.toString()}>
          <Tabs
            value={currentTab}
            onChange={(_, newValue: number) => {
              setCurrentTab(newValue);
            }}
            variant="scrollable"
          >
            <Tab label={t("Import")} value={0} />
            <Tab label={t("Upload")} value={1} />
          </Tabs>

          <TabPanel className={styles.tabPanel} value="0">
            <ImportResourceActionsTemplate />
          </TabPanel>

          <TabPanel className={styles.tabPanel} value="1">
            <UploadResourceActionsTemplate />
          </TabPanel>
        </TabContext>
      </div>
    </Container>
  );
};

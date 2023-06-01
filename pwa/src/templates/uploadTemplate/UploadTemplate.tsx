import * as React from "react";
import * as styles from "./UploadTemplate.module.css";
import { Container } from "@conduction/components";
import { Alert, Heading1, Tab, TabContext, TabPanel, Tabs } from "@gemeente-denhaag/components-react";
import { t } from "i18next";
import { UploadResourceActionsTemplate } from "../templateParts/uploadResourceActions/UploadResourceActionsTemplate";

export const UploadTemplate: React.FC = () => {
  const [currentTab, setCurrentTab] = React.useState<number>(0);

  return (
    <Container layoutClassName={styles.container}>
      <Heading1>Upload and import</Heading1>

      {/* <Alert
        title="Attention"
        text="This page is availabel for development purposes only; it is not yet functional."
        variant="warning"
      /> */}

      <div className={styles.tabsContainer}>
        <TabContext value={currentTab.toString()}>
          <Tabs
            value={currentTab}
            onChange={(_, newValue: number) => {
              setCurrentTab(newValue);
            }}
            variant="scrollable"
          >
            <Tab label={t("Upload")} value={0} />
            <Tab label={t("Import")} value={1} />
          </Tabs>

          <TabPanel className={styles.tabPanel} value="0">
            <UploadResourceActionsTemplate />
          </TabPanel>

          <TabPanel className={styles.tabPanel} value="1">
            Import
          </TabPanel>
        </TabContext>
      </div>
    </Container>
  );
};

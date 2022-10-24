import * as React from "react";
import * as styles from "./ObjectsDetailTemplate.module.css";
import { Tab, TabContext, TabPanel, Tabs } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { QueryClient } from "react-query";
import { useObject } from "../../hooks/object";
import { Container } from "@conduction/components";
import Skeleton from "react-loading-skeleton";
import { EditObjectFormTemplate } from "../templateParts/objectsFormTemplate/EditObjectFormTemplate";

interface ObjectDetailTemplateProps {
  objectId: string;
}

export const ObjectDetailTemplate: React.FC<ObjectDetailTemplateProps> = ({ objectId }) => {
  const { t } = useTranslation();
  const [currentTab, setCurrentTab] = React.useState<number>(0);

  const queryClient = new QueryClient();
  const _useObject = useObject(queryClient);
  const getObject = _useObject.getOne(objectId);

  return (
    <Container layoutClassName={styles.container}>
      {getObject.isError && "Error..."}

      {getObject.isSuccess && <EditObjectFormTemplate object={getObject.data} {...{ objectId }} />}

      {getObject.isLoading && <Skeleton height="200px" />}

      <div className={styles.tabContainer}>
        <TabContext value={currentTab.toString()}>
          <Tabs
            value={currentTab}
            onChange={(_, newValue: number) => {
              setCurrentTab(newValue);
            }}
            variant="scrollable"
          >
            <Tab className={styles.tab} label={t("Logs")} value={0} />
          </Tabs>

          <TabPanel className={styles.tabPanel} value="0">
            {getObject.isLoading && <Skeleton height="200px" />}
            {getObject.isSuccess && <span>Logs</span>}
          </TabPanel>
        </TabContext>
      </div>
    </Container>
  );
};

import * as React from "react";
import * as styles from "./ObjectDetailTemplate.module.css";
import { Button, Heading1, Tab, TabContext, TabPanel, Tabs } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { QueryClient } from "react-query";
import { useObject } from "../../hooks/object";
import { Container } from "@conduction/components";
import { Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from "@gemeente-denhaag/table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
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

      {getObject.isSuccess && (
        <div className={styles.container}>
          <EditObjectFormTemplate object={getObject.data} {...{ objectId }} />

          <TabContext value={currentTab.toString()}>
            <Tabs
              value={currentTab}
              onChange={(_, newValue: number) => {
                setCurrentTab(newValue);
              }}
              variant="scrollable"
            >
              <Tab className={styles.tab} label={t("Attributes")} value={0} />
              <Tab className={styles.tab} label={t("Logs")} value={1} />
              <Tab className={styles.tab} label={t("ObjectEntities")} value={2} />
            </Tabs>

            <TabPanel className={styles.tabPanel} value="0">
              <div className={styles.addButton}>
                <Button className={styles.buttonIcon}>
                  <FontAwesomeIcon icon={faPlus} />
                  {t("Add")}
                </Button>
              </div>
              <span>Attributes</span>
            </TabPanel>

            <TabPanel className={styles.tabPanel} value="1">
              <span>Logs</span>
            </TabPanel>

            <TabPanel className={styles.tabPanel} value="2">
              <span>ObjectEntities</span>
            </TabPanel>
          </TabContext>
        </div>
      )}

      {getObject.isLoading && <Skeleton height="200px" />}
    </Container>
  );
};

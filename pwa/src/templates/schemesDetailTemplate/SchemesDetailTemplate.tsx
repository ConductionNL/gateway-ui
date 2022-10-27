import * as React from "react";
import * as styles from "./SchemesDetailTemplate.module.css";
import { useTranslation } from "react-i18next";
import { QueryClient } from "react-query";
import { Container } from "@conduction/components";
import Skeleton from "react-loading-skeleton";
import { useScheme } from "../../hooks/scheme";
import { EditSchemesFormTemplate } from "../templateParts/schemesForm/EditSchemesFormTemplate";
import { Tab, TabContext, TabPanel, Tabs } from "@gemeente-denhaag/components-react";
import { useObject } from "../../hooks/object";
import { ObjectsTable } from "../templateParts/objectsTable/ObjectsTable";

interface SchemesDetailPageProps {
  schemeId: string;
}

export const SchemesDetailTemplate: React.FC<SchemesDetailPageProps> = ({ schemeId }) => {
  const { t } = useTranslation();
  const [currentTab, setCurrentTab] = React.useState<number>(0);

  const queryClient = new QueryClient();
  const _useScheme = useScheme(queryClient);
  const getScheme = _useScheme.getOne(schemeId);

  const _useObject = useObject(queryClient);
  const getObjectsFromEntity = _useObject.getAllFromEntity(schemeId);

  return (
    <Container layoutClassName={styles.container}>
      {getScheme.isError && "Error..."}

      {getScheme.isSuccess && <EditSchemesFormTemplate scheme={getScheme.data} {...{ schemeId }} />}
      {getScheme.isLoading && <Skeleton height="200px" />}

      <div className={styles.tabContainer}>
        <TabContext value={currentTab.toString()}>
          <Tabs
            value={currentTab}
            onChange={(_, newValue: number) => {
              setCurrentTab(newValue);
            }}
            variant="scrollable"
          >
            <Tab className={styles.tab} label={t("Objects")} value={0} />
            <Tab className={styles.tab} label={t("Logs")} value={1} />
          </Tabs>

          <TabPanel className={styles.tabPanel} value="0">
            {getObjectsFromEntity.isLoading && <Skeleton height="100px" />}
            {getObjectsFromEntity.isSuccess && <ObjectsTable objects={getObjectsFromEntity.data} />}
          </TabPanel>

          <TabPanel className={styles.tabPanel} value="1">
            Logs are not yet supported.
          </TabPanel>
        </TabContext>
      </div>
    </Container>
  );
};

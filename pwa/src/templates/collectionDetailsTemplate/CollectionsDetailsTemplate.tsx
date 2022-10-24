import * as React from "react";
import * as styles from "./CollectionsDetailsTemplate.module.css";
import { useTranslation } from "react-i18next";
import { QueryClient } from "react-query";
import { Container } from "@conduction/components";
import Skeleton from "react-loading-skeleton";
import { Tab, TabContext, TabPanel, Tabs } from "@gemeente-denhaag/components-react";
import { useCollection } from "../../hooks/collection";
import { EditCollectionFormTemplate } from "../templateParts/collectionsForm/EditCollectionFormTemplate";

interface CollectionsDetailPageProps {
  collectionId: string;
}

export const CollectionsDetailTemplate: React.FC<CollectionsDetailPageProps> = ({ collectionId }) => {
  const { t } = useTranslation();
  const [currentTab, setCurrentTab] = React.useState<number>(0);

  const queryClient = new QueryClient();
  const _useCollection = useCollection(queryClient);
  const getCollection = _useCollection.getOne(collectionId);

  return (
    <Container layoutClassName={styles.container}>
      {getCollection.isLoading && <Skeleton height="200px" />}
      {getCollection.isError && "Error..."}

      {getCollection.isSuccess && <EditCollectionFormTemplate collection={getCollection.data} {...{ collectionId }} />}

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
            {getCollection.isLoading && <Skeleton height="200px" />}
            {getCollection.isSuccess && <span>Logs</span>}{" "}
          </TabPanel>
        </TabContext>
      </div>
    </Container>
  );
};

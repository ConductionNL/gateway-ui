import * as React from "react";
import * as styles from "./CollectionsDetailsTemplate.module.css";
import { useTranslation } from "react-i18next";
import { QueryClient } from "react-query";
import { Container } from "@conduction/components";
import Skeleton from "react-loading-skeleton";
import { Tab, TabContext, TabPanel, Tabs } from "@gemeente-denhaag/components-react";
import { useCollection } from "../../hooks/collection";
import { useIsLoading } from "../../context/isLoading";
import { useDashboardCard } from "../../hooks/useDashboardCard";
import { CollectionFormTemplate, formId } from "../templateParts/collectionsForm/CollectionFormTemplate";
import { useLog } from "../../hooks/log";
import { LogsTableTemplate } from "../templateParts/logsTable/LogsTableTemplate";
import { FormHeaderTemplate } from "../templateParts/formHeader/FormHeaderTemplate";

interface CollectionsDetailPageProps {
  collectionId: string;
}

export const CollectionsDetailTemplate: React.FC<CollectionsDetailPageProps> = ({ collectionId }) => {
  const { t } = useTranslation();
  const { setIsLoading, isLoading } = useIsLoading();
  const [currentTab, setCurrentTab] = React.useState<number>(0);
  const [currentLogsPage, setCurrentLogsPage] = React.useState<number>(1);

  const { toggleDashboardCard, getDashboardCard, loading: dashboardLoading } = useDashboardCard();

  const queryClient = new QueryClient();
  const _useCollection = useCollection(queryClient);
  const getCollection = _useCollection.getOne(collectionId);
  const deleteCollection = _useCollection.remove();

  const getLogs = useLog(queryClient).getAllFromChannel("collection", collectionId, currentLogsPage);

  const dashboardCard = getDashboardCard(collectionId);

  const toggleFromDashboard = (): void => {
    toggleDashboardCard(getCollection.data.name, "collection", "CollectionEntity", collectionId, dashboardCard?.id);
  };

  const handleDeleteAction = (): void => {
    const confirmDeletion = confirm("Are you sure you want to delete this collection?");

    confirmDeletion && deleteCollection.mutateAsync({ id: collectionId });
  };

  React.useEffect(() => {
    setIsLoading({ collectionForm: deleteCollection.isLoading || dashboardLoading });
  }, [deleteCollection.isLoading, dashboardLoading]);

  return (
    <Container layoutClassName={styles.container}>
      {getCollection.isSuccess && (
        <>
          <FormHeaderTemplate
            title={`Edit ${getCollection.data.name}`}
            {...{ formId }}
            disabled={isLoading.collectionForm}
            handleDelete={handleDeleteAction}
            handleToggleDashboard={{ handleToggle: toggleFromDashboard, isActive: !!dashboardCard }}
          />

          <CollectionFormTemplate collection={getCollection.data} />
        </>
      )}

      {getCollection.isLoading && <Skeleton height="200px" />}
      {getCollection.isError && "Error..."}

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
            {getLogs.isLoading && <Skeleton height="200px" />}

            {getLogs.isSuccess && (
              <LogsTableTemplate
                logs={getLogs.data.results}
                pagination={{
                  totalPages: getLogs.data.pages,
                  currentPage: currentLogsPage,
                  changePage: setCurrentLogsPage,
                }}
              />
            )}
          </TabPanel>
        </TabContext>
      </div>
    </Container>
  );
};

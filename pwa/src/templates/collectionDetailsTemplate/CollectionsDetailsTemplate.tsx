import * as React from "react";
import * as styles from "./CollectionsDetailsTemplate.module.css";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "react-query";
import { Container } from "@conduction/components";
import Skeleton from "react-loading-skeleton";
import { Tab, TabContext, TabPanel, Tabs } from "@gemeente-denhaag/components-react";
import { useCollection } from "../../hooks/collection";
import { useIsLoadingContext } from "../../context/isLoading";
import { useDashboardCard } from "../../hooks/useDashboardCard";
import { CollectionFormTemplate, formId } from "../templateParts/collectionsForm/CollectionFormTemplate";
import { useLog } from "../../hooks/log";
import { LogsTableTemplate } from "../templateParts/logsTable/LogsTableTemplate";
import { FormHeaderTemplate } from "../templateParts/formHeader/FormHeaderTemplate";
import { CHANNEL_LOG_LIMIT } from "../../apiService/resources/log";

interface CollectionsDetailPageProps {
  collectionId: string;
}

export const CollectionsDetailTemplate: React.FC<CollectionsDetailPageProps> = ({ collectionId }) => {
  const { t } = useTranslation();
  const { setIsLoading, isLoading } = useIsLoadingContext();
  const [currentTab, setCurrentTab] = React.useState<number>(0);
  const [currentLogsPage, setCurrentLogsPage] = React.useState<number>(1);

  const { toggleDashboardCard, getDashboardCard, loading: dashboardLoading } = useDashboardCard();

  const queryClient = useQueryClient();
  const _useCollection = useCollection(queryClient);
  const getCollection = _useCollection.getOne(collectionId);
  const deleteCollection = _useCollection.remove();

  const getLogs = useLog(queryClient).getAllFromChannel("collection", collectionId, currentLogsPage);

  const dashboardCard = getDashboardCard(collectionId);

  const toggleFromDashboard = (): void => {
    toggleDashboardCard(getCollection.data.name, "collection", "CollectionEntity", collectionId, dashboardCard?.id);
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
            handleDelete={() => deleteCollection.mutateAsync({ id: collectionId })}
            handleToggleDashboard={{ handleToggle: toggleFromDashboard, isActive: !!dashboardCard }}
            showTitleTooltip
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
                  data: {
                    count: getLogs.data.results.length,
                    offset: CHANNEL_LOG_LIMIT * (currentLogsPage - 1),
                    pages: getLogs.data.pages,
                    total: getLogs.data.total,
                  },
                  currentPage: currentLogsPage,
                  setCurrentPage: setCurrentLogsPage,
                }}
              />
            )}
          </TabPanel>
        </TabContext>
      </div>
    </Container>
  );
};

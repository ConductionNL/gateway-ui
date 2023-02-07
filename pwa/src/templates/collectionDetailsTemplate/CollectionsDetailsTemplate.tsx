import * as React from "react";
import * as styles from "./CollectionsDetailsTemplate.module.css";
import { useTranslation } from "react-i18next";
import { QueryClient } from "react-query";
import { Container } from "@conduction/components";
import Skeleton from "react-loading-skeleton";
import { Button, Heading1, Tab, TabContext, TabPanel, Tabs } from "@gemeente-denhaag/components-react";
import { useCollection } from "../../hooks/collection";
import { faFloppyDisk, faMinus, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import { isLoading, IsLoadingContext } from "../../context/isLoading";
import { useDashboardCard } from "../../hooks/useDashboardCard";
import { CollectionFormTemplate, formId } from "../templateParts/collectionsForm/CollectionFormTemplate";
import { useLog } from "../../hooks/log";
import { LogsTableTemplate } from "../templateParts/logsTable/LogsTableTemplate";

interface CollectionsDetailPageProps {
  collectionId: string;
}

export const CollectionsDetailTemplate: React.FC<CollectionsDetailPageProps> = ({ collectionId }) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = React.useContext(IsLoadingContext);
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

  const handleDelete = (): void => {
    const confirmDeletion = confirm("Are you sure you want to delete this collection?");

    confirmDeletion && deleteCollection.mutateAsync({ id: collectionId });
  };

  React.useEffect(() => {
    setIsLoading({ ...isLoading, collectionForm: deleteCollection.isLoading || dashboardLoading });
  }, [deleteCollection.isLoading, dashboardLoading]);

  return (
    <Container layoutClassName={styles.container}>
      {getCollection.isSuccess && (
        <>
          <section className={styles.section}>
            <Heading1>{`Edit ${getCollection.data.name}`}</Heading1>

            <div className={styles.buttons}>
              <Button
                type="submit"
                form={formId}
                disabled={isLoading.collectionForm}
                className={clsx(styles.buttonIcon, styles.button)}
              >
                <FontAwesomeIcon icon={faFloppyDisk} />
                {t("Save")}
              </Button>

              <Button
                className={clsx(styles.buttonIcon, styles.button)}
                onClick={toggleFromDashboard}
                disabled={isLoading.collectionForm}
              >
                <FontAwesomeIcon icon={dashboardCard ? faMinus : faPlus} />
                {dashboardCard ? t("Remove from dashboard") : t("Add to dashboard")}
              </Button>

              <Button
                className={clsx(styles.buttonIcon, styles.button, styles.deleteButton)}
                onClick={handleDelete}
                disabled={isLoading.collectionForm}
              >
                <FontAwesomeIcon icon={faTrash} />
                {t("Delete")}
              </Button>
            </div>
          </section>

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

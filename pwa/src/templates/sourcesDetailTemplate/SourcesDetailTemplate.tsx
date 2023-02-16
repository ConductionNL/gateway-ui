import * as React from "react";
import * as styles from "./SourcesDetailTemplate.module.css";
import { useQueryClient } from "react-query";
import _ from "lodash";
import { useSource } from "../../hooks/source";
import { Container } from "@conduction/components";
import Skeleton from "react-loading-skeleton";
import { Tab, TabContext, TabPanel, Tabs } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { useIsLoadingContext } from "../../context/isLoading";
import { useCurrentTabContext } from "../../context/tabs";
import { SourceFormTemplate, formId } from "../templateParts/sourcesForm/SourceFormTemplate";
import { useDashboardCard } from "../../hooks/useDashboardCard";
import { FormHeaderTemplate } from "../templateParts/formHeader/FormHeaderTemplate";
import { useLog } from "../../hooks/log";
import { LogsTableTemplate } from "../templateParts/logsTable/LogsTableTemplate";
import { TestSourceConnectionFormTemplate } from "./TestSourceConnectionForm/TestSourceConnectionFormTemplate";

interface SourcesDetailTemplateProps {
  sourceId: string;
}

export const SourcesDetailTemplate: React.FC<SourcesDetailTemplateProps> = ({ sourceId }) => {
  const { t } = useTranslation();
  const { currentTabs, setCurrentTabs } = useCurrentTabContext();
  const { setIsLoading, isLoading } = useIsLoadingContext();
  const [currentLogsPage, setCurrentLogsPage] = React.useState<number>(1);

  const queryClient = useQueryClient();
  const _useSource = useSource(queryClient);

  const getLogs = useLog(queryClient).getAllFromChannel("source", sourceId, currentLogsPage);

  const getSource = _useSource.getOne(sourceId);
  const deleteSource = _useSource.remove();

  const { toggleDashboardCard, getDashboardCard, loading: dashboardLoading } = useDashboardCard();

  const dashboardCard = getDashboardCard(getSource.data?.id);

  const toggleFromDashboard = () => {
    toggleDashboardCard(getSource.data.name, "source", "Gateway", sourceId, dashboardCard?.id);
  };

  const handleDelete = (): void => {
    const confirmDeletion = confirm("Are you sure you want to delete this source?");

    confirmDeletion && deleteSource.mutateAsync({ id: sourceId });
  };

  React.useEffect(() => {
    setIsLoading({ sourceForm: deleteSource.isLoading || dashboardLoading });
  }, [deleteSource.isLoading, dashboardLoading]);

  return (
    <Container layoutClassName={styles.container}>
      {getSource.isLoading && <Skeleton height="200px" />}
      {getSource.isError && "Error..."}

      {getSource.isSuccess && (
        <>
          <FormHeaderTemplate
            {...{ formId, handleDelete }}
            disabled={isLoading.sourceForm}
            title={`Edit ${getSource.data.name}`}
            handleToggleDashboard={{ handleToggle: toggleFromDashboard, isActive: !!dashboardCard }}
          />

          <SourceFormTemplate source={getSource.data} />
        </>
      )}

      <div className={styles.tabContainer}>
        <TabContext value={currentTabs.sourceDetailTabs.toString()}>
          <Tabs
            value={currentTabs.sourceDetailTabs}
            onChange={(_, newValue: number) => {
              setCurrentTabs({ ...currentTabs, sourceDetailTabs: newValue });
            }}
            variant="scrollable"
          >
            <Tab className={styles.tab} label={t("Test Connection")} value={0} />
            <Tab className={styles.tab} label={t("Logs")} value={1} />
          </Tabs>

          <TabPanel className={styles.tabPanel} value="0">
            {getSource.isLoading && <Skeleton height="200px" />}
            {getSource.isSuccess && <TestSourceConnectionFormTemplate {...{ sourceId }} />}
          </TabPanel>

          <TabPanel className={styles.tabPanel} value="1">
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

            {getLogs.isLoading && <Skeleton height="200px" />}
          </TabPanel>
        </TabContext>
      </div>
    </Container>
  );
};

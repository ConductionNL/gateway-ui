import * as React from "react";
import * as styles from "./CronjobsDetailsTemplate.module.css";
import { useTranslation } from "react-i18next";
import { QueryClient } from "react-query";
import { useCronjob } from "../../hooks/cronjob";
import { Container } from "@conduction/components";
import Skeleton from "react-loading-skeleton";
import { Tab, TabContext, TabPanel, Tabs } from "@gemeente-denhaag/components-react";
import { CronjobFormTemplate, formId } from "../templateParts/cronjobsForm/CronjobsFormTemplate";
import { IsLoadingContext } from "../../context/isLoading";
import { useDashboardCard } from "../../hooks/useDashboardCard";
import { FormHeaderTemplate } from "../templateParts/formHeader/FormHeaderTemplate";
import { useLog } from "../../hooks/log";
import { LogsTableTemplate } from "../templateParts/logsTable/LogsTableTemplate";

interface CronjobDetailPageProps {
  cronjobId: string;
}

export const CronjobsDetailTemplate: React.FC<CronjobDetailPageProps> = ({ cronjobId }) => {
  const { t } = useTranslation();
  const [currentTab, setCurrentTab] = React.useState<number>(0);
  const [isLoading, setIsLoading] = React.useContext(IsLoadingContext);
  const [currentLogsPage, setCurrentLogsPage] = React.useState<number>(1);
  const { toggleDashboardCard, getDashboardCard, loading: dashboardLoading } = useDashboardCard();

  const queryClient = new QueryClient();
  const _useCronjob = useCronjob(queryClient);
  const getCronjob = _useCronjob.getOne(cronjobId);
  const deleteCronjob = _useCronjob.remove();

  const getLogs = useLog(queryClient).getAllFromChannel("cronjob", cronjobId, currentLogsPage);

  const dashboardCard = getDashboardCard(cronjobId);

  const toggleFromDashboard = () => {
    toggleDashboardCard(getCronjob.data.name, "cronjob", "Cronjob", cronjobId, dashboardCard?.id);
  };

  const handleDeleteCronjob = (): void => {
    const confirmDeletion = confirm("Are you sure you want to delete this cronjob?");

    confirmDeletion && deleteCronjob.mutateAsync({ id: cronjobId });
  };

  React.useEffect(() => {
    setIsLoading({ ...isLoading, cronjobForm: deleteCronjob.isLoading || dashboardLoading });
  }, [deleteCronjob.isLoading, dashboardLoading]);

  return (
    <Container layoutClassName={styles.container}>
      {getCronjob.isSuccess && (
        <>
          <FormHeaderTemplate
            title={`Edit ${getCronjob.data.name}`}
            {...{ formId }}
            disabled={isLoading.cronjobForm}
            handleDelete={handleDeleteCronjob}
            handleToggleDashboard={{ handleToggle: toggleFromDashboard, isActive: !!dashboardCard }}
          />

          <CronjobFormTemplate cronjob={getCronjob.data} />
        </>
      )}

      {getCronjob.isError && "Error..."}

      {getCronjob.isLoading && <Skeleton height="200px" />}

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
            <Tab className={styles.tab} label={t("Actions")} value={1} />
          </Tabs>

          <TabPanel className={styles.tabPanel} value="0">
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

          <TabPanel className={styles.tabPanel} value="1">
            {getCronjob.isLoading && <Skeleton height="200px" />}
            {getCronjob.isSuccess && <span>Actions</span>}
          </TabPanel>
        </TabContext>
      </div>
    </Container>
  );
};

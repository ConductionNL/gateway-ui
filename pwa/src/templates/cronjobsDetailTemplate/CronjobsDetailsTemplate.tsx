import * as React from "react";
import * as styles from "./CronjobsDetailsTemplate.module.css";
import { useTranslation } from "react-i18next";
import { QueryClient } from "react-query";
import { useCronjob } from "../../hooks/cronjob";
import { Container } from "@conduction/components";
import Skeleton from "react-loading-skeleton";
import { Button, Heading1, Tab, TabContext, TabPanel, Tabs } from "@gemeente-denhaag/components-react";
import { CronjobFormTemplate, formId } from "../templateParts/cronjobsForm/CronjobsFormTemplate";
import { faFloppyDisk, faMinus, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import { IsLoadingContext } from "../../context/isLoading";
import { useDashboardCard } from "../../hooks/useDashboardCard";

interface CronjobDetailPageProps {
  cronjobId: string;
}

export const CronjobsDetailTemplate: React.FC<CronjobDetailPageProps> = ({ cronjobId }) => {
  const { t } = useTranslation();
  const [currentTab, setCurrentTab] = React.useState<number>(0);
  const [isLoading, setIsLoading] = React.useContext(IsLoadingContext);
  const { toggleDashboardCard, getDashboardCard, loading: dashboardLoading } = useDashboardCard();

  const queryClient = new QueryClient();
  const _useCronjob = useCronjob(queryClient);
  const getCronjob = _useCronjob.getOne(cronjobId);
  const deleteCronjob = _useCronjob.remove();

  const dashboardCard = getDashboardCard(cronjobId);

  const toggleFromDashboard = () => {
    toggleDashboardCard(getCronjob.data.name, "cronjob", "Cronjob", cronjobId, dashboardCard?.id);
  };

  const handleDelete = (id: string): void => {
    const confirmDeletion = confirm("Are you sure you want to delete this cronjob?");

    confirmDeletion && deleteCronjob.mutateAsync({ id: id });
  };

  React.useEffect(() => {
    setIsLoading({ ...isLoading, cronjobForm: deleteCronjob.isLoading || dashboardLoading });
  }, [deleteCronjob.isLoading, dashboardLoading]);

  return (
    <Container layoutClassName={styles.container}>
      {getCronjob.isSuccess && (
        <>
          <section className={styles.section}>
            <Heading1>{`Edit ${getCronjob.data.name}`}</Heading1>

            <div className={styles.buttons}>
              <Button
                type="submit"
                form={formId}
                disabled={isLoading.cronjobForm}
                className={clsx(styles.buttonIcon, styles.button)}
              >
                <FontAwesomeIcon icon={faFloppyDisk} />
                {t("Save")}
              </Button>

              <Button
                className={clsx(styles.buttonIcon, styles.button)}
                onClick={toggleFromDashboard}
                disabled={isLoading.cronjobForm}
              >
                <FontAwesomeIcon icon={dashboardCard ? faMinus : faPlus} />
                {dashboardCard ? t("Remove from dashboard") : t("Add to dashboard")}
              </Button>

              <Button
                className={clsx(styles.buttonIcon, styles.button, styles.deleteButton)}
                onClick={() => handleDelete(getCronjob.data.id)}
                disabled={isLoading.cronjobForm}
              >
                <FontAwesomeIcon icon={faTrash} />
                {t("Delete")}
              </Button>
            </div>
          </section>

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
            {getCronjob.isLoading && <Skeleton height="200px" />}
            {getCronjob.isSuccess && <span>Logs</span>}{" "}
          </TabPanel>
          <TabPanel className={styles.tabPanel} value="1">
            {getCronjob.isLoading && <Skeleton height="200px" />}
            {getCronjob.isSuccess && <span>Actions</span>}{" "}
          </TabPanel>
        </TabContext>
      </div>
    </Container>
  );
};

import * as React from "react";
import * as styles from "./EndpointDetailsTemplate.module.css";
import { useTranslation } from "react-i18next";
import { QueryClient } from "react-query";
import { useEndpoint } from "../../hooks/endpoint";
import { Container } from "@conduction/components";
import Skeleton from "react-loading-skeleton";
import { Button, Heading1, Tab, TabContext, TabPanel, Tabs } from "@gemeente-denhaag/components-react";
import { Table, TableBody, TableCell, TableRow } from "@gemeente-denhaag/table";
import { SchemasTable } from "../templateParts/schemasTable/SchemasTable";
import { faFloppyDisk, faMinus, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import { EndpointFormTemplate, formId } from "../templateParts/endpointsForm/EndpointFormTemplate";
import { useDashboardCard } from "../../hooks/useDashboardCard";
import { IsLoadingContext } from "../../context/isLoading";

interface EndpointDetailsTemplateProps {
  endpointId: string;
}

export const EndpointDetailTemplate: React.FC<EndpointDetailsTemplateProps> = ({ endpointId }) => {
  const { t } = useTranslation();
  const [currentTab, setCurrentTab] = React.useState<number>(0);
  const [isLoading, setIsLoading] = React.useContext(IsLoadingContext);
  const { toggleDashboardCard, getDashboardCard, loading: dashboardLoading } = useDashboardCard();

  const queryClient = new QueryClient();
  const _useEndpoints = useEndpoint(queryClient);
  const getEndpoint = _useEndpoints.getOne(endpointId);
  const deleteEndpoint = _useEndpoints.remove();

  const dashboardCard = getDashboardCard(endpointId);

  const toggleFromDashboard = () => {
    toggleDashboardCard(getEndpoint.data.name, "endpoint", "Endpoint", endpointId, dashboardCard?.id);
  };

  const handleDelete = () => {
    const confirmDeletion = confirm("Are you sure you want to delete this endpoint?");

    confirmDeletion && deleteEndpoint.mutate({ id: endpointId });
  };

  React.useEffect(() => {
    setIsLoading({ ...isLoading, endpointForm: deleteEndpoint.isLoading || dashboardLoading });
  }, [deleteEndpoint.isLoading, dashboardLoading]);

  return (
    <Container layoutClassName={styles.container}>
      {getEndpoint.isSuccess && (
        <>
          <section className={styles.section}>
            <Heading1>{`Edit ${getEndpoint.data.name}`}</Heading1>

            <div className={styles.buttons}>
              <Button
                type="submit"
                form={formId}
                disabled={isLoading.endpointForm}
                className={clsx(styles.buttonIcon, styles.button)}
              >
                <FontAwesomeIcon icon={faFloppyDisk} />
                {t("Save")}
              </Button>

              <Button
                className={clsx(styles.buttonIcon, styles.button)}
                onClick={toggleFromDashboard}
                disabled={isLoading.endpointForm}
              >
                <FontAwesomeIcon icon={dashboardCard ? faMinus : faPlus} />
                {dashboardCard ? t("Remove from dashboard") : t("Add to dashboard")}
              </Button>

              <Button
                className={clsx(styles.buttonIcon, styles.button, styles.deleteButton)}
                onClick={handleDelete}
                disabled={isLoading.endpointForm}
              >
                <FontAwesomeIcon icon={faTrash} />
                {t("Delete")}
              </Button>
            </div>
          </section>

          <EndpointFormTemplate endpoint={getEndpoint.data} />
        </>
      )}

      {getEndpoint.isLoading && <Skeleton height="200px" />}

      {getEndpoint.isError && "Error..."}

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
            <Tab className={styles.tab} label={t("Subscribed Throws")} value={1} />
            <Tab className={styles.tab} label={t("Selected Schemas")} value={2} />
          </Tabs>

          <TabPanel className={styles.tabPanel} value="0">
            {getEndpoint.isLoading && <Skeleton height="200px" />}
            {getEndpoint.isSuccess && <span>Logs</span>}
          </TabPanel>
          <TabPanel className={styles.tabPanel} value="1">
            {getEndpoint.isSuccess && (
              <Table>
                <TableBody>
                  {getEndpoint.data.throws?.map((thrown: any, idx: number) => (
                    <TableRow key={idx}>
                      <TableCell>{thrown}</TableCell>
                    </TableRow>
                  ))}

                  {!getEndpoint.data.throws?.length && (
                    <TableRow>
                      <TableCell>No subscribed throws.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </TabPanel>
          <TabPanel className={styles.tabPanel} value="2">
            {getEndpoint.isSuccess && <SchemasTable schemas={getEndpoint.data.entities} />}
          </TabPanel>
        </TabContext>
      </div>
    </Container>
  );
};

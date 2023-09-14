import * as React from "react";
import * as styles from "./EndpointDetailsTemplate.module.css";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "react-query";
import { useEndpoint } from "../../hooks/endpoint";
import { Container } from "@conduction/components";
import Skeleton from "react-loading-skeleton";
import { Tab, TabContext, TabPanel, Tabs } from "@gemeente-denhaag/components-react";
import { Table, TableBody, TableCell, TableRow } from "@gemeente-denhaag/table";
import { SchemasTable } from "../templateParts/schemasTable/SchemasTable";
import { EndpointFormTemplate, formId } from "../templateParts/endpointsForm/EndpointFormTemplate";
import { useDashboardCard } from "../../hooks/useDashboardCard";
import { useIsLoadingContext } from "../../context/isLoading";
import { FormHeaderTemplate } from "../templateParts/formHeader/FormHeaderTemplate";
import { useLog } from "../../hooks/log";
import { LogsTableTemplate } from "../templateParts/logsTable/LogsTableTemplate";
import { CHANNEL_LOG_LIMIT } from "../../apiService/resources/log";

interface EndpointDetailsTemplateProps {
  endpointId: string;
}

export const EndpointDetailTemplate: React.FC<EndpointDetailsTemplateProps> = ({ endpointId }) => {
  const { t } = useTranslation();
  const [currentTab, setCurrentTab] = React.useState<number>(0);
  const { setIsLoading, isLoading } = useIsLoadingContext();
  const [currentLogsPage, setCurrentLogsPage] = React.useState<number>(1);
  const { toggleDashboardCard, getDashboardCard, loading: dashboardLoading } = useDashboardCard();

  const queryClient = useQueryClient();
  const _useEndpoints = useEndpoint(queryClient);
  const getEndpoint = _useEndpoints.getOne(endpointId);
  const deleteEndpoint = _useEndpoints.remove();

  const getLogs = useLog(queryClient).getAllFromChannel("endpoint", endpointId, currentLogsPage);

  const dashboardCard = getDashboardCard(endpointId);

  const toggleFromDashboard = () => {
    toggleDashboardCard(getEndpoint.data.name, "endpoint", "Endpoint", endpointId, dashboardCard?.id);
  };

  React.useEffect(() => {
    setIsLoading({ endpointForm: deleteEndpoint.isLoading || dashboardLoading });
  }, [deleteEndpoint.isLoading, dashboardLoading]);

  return (
    <Container layoutClassName={styles.container}>
      {getEndpoint.isSuccess && (
        <>
          <FormHeaderTemplate
            title={`Edit ${getEndpoint.data.name}`}
            {...{ formId }}
            disabled={isLoading.endpointForm}
            handleDelete={() => deleteEndpoint.mutate({ id: endpointId })}
            handleToggleDashboard={{ handleToggle: toggleFromDashboard, isActive: !!dashboardCard }}
            showTitleTooltip
          />

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

            {getLogs.isLoading && <Skeleton height="200px" />}
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

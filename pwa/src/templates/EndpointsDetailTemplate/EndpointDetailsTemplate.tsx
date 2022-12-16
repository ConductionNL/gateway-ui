import * as React from "react";
import * as styles from "./EndpointDetailsTemplate.module.css";
import { useTranslation } from "react-i18next";
import { QueryClient } from "react-query";
import { useEndpoint } from "../../hooks/endpoint";
import { Container } from "@conduction/components";
import Skeleton from "react-loading-skeleton";
import { EditEndpointFormTemplate } from "../templateParts/endpointsForm/EditEndpointsFormTemplate";
import { Tab, TabContext, TabPanel, Tabs } from "@gemeente-denhaag/components-react";
import { Table, TableBody, TableCell, TableRow } from "@gemeente-denhaag/table";
import { SchemasTable } from "../templateParts/schemasTable/SchemasTable";

interface EndpointDetailsTemplateProps {
  endpointId: string;
}

export const EndpointDetailTemplate: React.FC<EndpointDetailsTemplateProps> = ({ endpointId }) => {
  const { t } = useTranslation();
  const [currentTab, setCurrentTab] = React.useState<number>(0);

  const queryClient = new QueryClient();
  const _useEndpoints = useEndpoint(queryClient);
  const getEndpoint = _useEndpoints.getOne(endpointId);

  return (
    <Container layoutClassName={styles.container}>
      {getEndpoint.isLoading && <Skeleton height="200px" />}
      {getEndpoint.isError && "Error..."}

      {getEndpoint.isSuccess && <EditEndpointFormTemplate endpoint={getEndpoint.data} {...{ endpointId }} />}

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
                  {getEndpoint.data.throws.map((thrown: any, idx: number) => (
                    <TableRow key={idx}>
                      <TableCell>{thrown}</TableCell>
                    </TableRow>
                  ))}

                  {!getEndpoint.data.throws.length && (
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

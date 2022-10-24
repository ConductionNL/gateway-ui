import * as React from "react";
import * as styles from "./EndpointsTemplate.module.css";
import { Button, Heading1, Tab, TabContext, TabPanel, Tabs } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from "@gemeente-denhaag/table";
import { navigate } from "gatsby";
import { useEndpoint } from "../../hooks/endpoint";
import { QueryClient } from "react-query";
import { Container, Tag } from "@conduction/components";
import Skeleton from "react-loading-skeleton";
import clsx from "clsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { translateDate } from "../../services/dateFormat";

export const EndpointsTemplate: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [currentTab, setCurrentTab] = React.useState<number>(0);

  const queryClient = new QueryClient();
  const _useEndpoints = useEndpoint(queryClient);
  const getEndpoints = _useEndpoints.getAll();

  return (
    <Container layoutClassName={styles.container}>
      <section className={styles.section}>
        <Heading1>{t("Endpoints")}</Heading1>
        <div className={styles.buttons}>
          <Button className={styles.buttonIcon} onClick={() => navigate(`/endpoints/new`)}>
            <FontAwesomeIcon icon={faPlus} />
            {t("Add")}
          </Button>
        </div>
      </section>

      {getEndpoints.isError && "Error..."}

      {getEndpoints.isSuccess && (
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>Name</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader>Path regex</TableHeader>
              <TableHeader>Date Created</TableHeader>
              <TableHeader>Date Modified</TableHeader>
              <TableHeader>Throws</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {getEndpoints.data.map((endpoint: any) => (
              <TableRow onClick={() => navigate(`/endpoints/${endpoint.id}`)} key={endpoint.id}>
                <TableCell>{endpoint.name}</TableCell>
                <TableCell>
                  <div className={clsx(styles[endpoint.status === "Ok" ? "statusOk" : "statusFailed"])}>
                    <Tag label={endpoint.status?.toString() ?? "-"} />
                  </div>
                </TableCell>
                <TableCell>{endpoint.pathRegex ?? "-"}</TableCell>
                <TableCell>{translateDate(i18n.language, endpoint.dateCreated)}</TableCell>
                <TableCell>{translateDate(i18n.language, endpoint.dateModified)}</TableCell>
                <TableCell>{endpoint.throws ?? "-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {getEndpoints.isLoading && <Skeleton height="200px" />}

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
            {getEndpoints.isLoading && <Skeleton height="200px" />}
            {getEndpoints.isSuccess && <span>Logs</span>}
          </TabPanel>
        </TabContext>
      </div>
    </Container>
  );
};

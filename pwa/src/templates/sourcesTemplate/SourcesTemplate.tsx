import * as React from "react";
import * as styles from "./SourcesTemplate.module.css";
import { Button, Heading1, Link, Tab, TabContext, TabPanel, Tabs } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from "@gemeente-denhaag/table";
import { navigate } from "gatsby";
import { useSource } from "../../hooks/source";
import { QueryClient } from "react-query";
import { Tag } from "@conduction/components";
import _ from "lodash";
import clsx from "clsx";
import { ArrowRightIcon } from "@gemeente-denhaag/icons";
import { translateDate } from "../../services/dateFormat";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Skeleton from "react-loading-skeleton";

export const SourcesTemplate: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [currentTab, setCurrentTab] = React.useState<number>(0);

  const queryClient = new QueryClient();
  const _useSources = useSource(queryClient);
  const getSources = _useSources.getAll();

  return (
    <div className={styles.container}>
      <section className={styles.section}>
        <Heading1>{t("Sources")}</Heading1>
        <div className={styles.buttons}>
          <Button className={styles.buttonIcon} onClick={() => navigate(`/sources/new`)}>
            <FontAwesomeIcon icon={faPlus} />
            {t("Add")}
          </Button>
        </div>
      </section>

      {getSources.isError && "Error..."}

      {getSources.isSuccess && (
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>{t("Name")}</TableHeader>
              <TableHeader>{t("Status")}</TableHeader>
              <TableHeader>{t("Related Sync objects")}</TableHeader>
              <TableHeader>{t("Last call")}</TableHeader>
              <TableHeader>{t("Created")}</TableHeader>
              <TableHeader>{t("Modified")}</TableHeader>
              <TableHeader />
            </TableRow>
          </TableHead>
          <TableBody>
            {getSources.data.map((source) => (
              <TableRow className={styles.tableRow} onClick={() => navigate(`/sources/${source.id}`)} key={source.id}>
                <TableCell>{source.name}</TableCell>
                <TableCell>
                  <div className={clsx(styles[source.status === "Ok" ? "statusOk" : "statusFailed"])}>
                    <Tag label={source.status ?? "-"} />
                  </div>
                </TableCell>
                <TableCell>{source.lastRun ?? "-"}</TableCell>
                <TableCell>{source.sync ?? "-"}</TableCell>
                <TableCell>{translateDate(i18n.language, source.dateCreated)}</TableCell>
                <TableCell>{translateDate(i18n.language, source.dateModified)}</TableCell>
                <TableCell onClick={() => navigate(`/sources/${source.id}`)}>
                  <Link icon={<ArrowRightIcon />} iconAlign="start">
                    {t("Details")}
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {getSources.isLoading && <Skeleton height="200px" />}

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
            {getSources.isLoading && <Skeleton height="200px" />}
            {getSources.isSuccess && <span>Logs</span>}{" "}
          </TabPanel>
        </TabContext>
      </div>
    </div>
  );
};

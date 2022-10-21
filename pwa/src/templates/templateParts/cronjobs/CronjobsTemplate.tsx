import * as React from "react";
import * as styles from "./CronjobTemplate.module.css";
import { Button, Heading1, Link, Tab, TabContext, TabPanel, Tabs } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@gemeente-denhaag/table";
import { QueryClient } from "react-query";
import { useCronjob } from "../../../hooks/cronjob";
import { navigate } from "gatsby";
import { Container, Tag } from "@conduction/components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Skeleton from "react-loading-skeleton";
import { ArrowRightIcon } from "@gemeente-denhaag/icons";
import clsx from "clsx";

export const CronjobsTemplate: React.FC = () => {
  const { t } = useTranslation();
  const [currentTab, setCurrentTab] = React.useState<number>(0);

  const queryClient = new QueryClient();
  const _useCronjob = useCronjob(queryClient);
  const getCronjobs = _useCronjob.getAll();

  return (
    <Container layoutClassName={styles.container}>
      <section className={styles.section}>
        <Heading1>{t("Cronjobs")}</Heading1>
        <div className={styles.buttons}>
          <Button className={styles.buttonIcon} onClick={() => navigate(`/cronjobs/new`)}>
            <FontAwesomeIcon icon={faPlus} />
            {t("Add")}
          </Button>
        </div>
      </section>

      {getCronjobs.isError && "Error..."}

      {getCronjobs.isSuccess && (
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>{t("Name")}</TableHeader>
              <TableHeader>{t("Status")}</TableHeader>
              <TableHeader>{t("Active")}</TableHeader>
              <TableHeader>CronTab</TableHeader>
              <TableHeader>{t("Last run")}</TableHeader>
              <TableHeader>{t("Next run")}</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader>{t("Date created")}</TableHeader>
              <TableHeader>{t("Date modified")}</TableHeader>
              <TableHeader></TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {getCronjobs.data.map((cronjob) => (
              <TableRow
                className={styles.tableRow}
                onClick={() => navigate(`/cronjobs/${cronjob.id}`)}
                key={cronjob.id}
              >
                <TableCell>{cronjob.name}</TableCell>
                <TableCell>
                  <div className={clsx(styles[cronjob.status === "Ok" ? "statusOk" : "statusFailed"])}>
                    <Tag label={cronjob.status?.toString() ?? "-"} />
                  </div>
                </TableCell>
                <TableCell>-</TableCell>
                <TableCell>{cronjob.crontab}</TableCell>
                <TableCell>{cronjob.lastRun}</TableCell>
                <TableCell>{cronjob.nextRun}</TableCell>
                <TableCell>-</TableCell>
                <TableCell>-</TableCell>
                <TableCell>-</TableCell>
                <TableCell onClick={() => navigate(`/cronjobs/${cronjob.id}`)}>
                  <Link className={styles.detailsLink} icon={<ArrowRightIcon />} iconAlign="start">
                    {t("Details")}
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {getCronjobs.isLoading && <Skeleton height="200px" />}

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
            {getCronjobs.isLoading && <Skeleton height="200px" />}
            {getCronjobs.isSuccess && <span>Logs</span>}{" "}
          </TabPanel>
        </TabContext>
      </div>
    </Container>
  );
};

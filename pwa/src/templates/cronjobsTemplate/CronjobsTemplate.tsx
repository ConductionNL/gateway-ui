import * as React from "react";
import * as styles from "./CronjobsTemplate.module.css";
import { Button, Heading1, Link } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@gemeente-denhaag/table";
import { QueryClient } from "react-query";
import { useCronjob } from "../../hooks/cronjob";
import { navigate } from "gatsby";
import { Container, Tag, ToolTip } from "@conduction/components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import Skeleton from "react-loading-skeleton";
import { ArrowRightIcon } from "@gemeente-denhaag/icons";
import clsx from "clsx";
import { translateDate } from "../../services/dateFormat";
import { dateTime } from "../../services/dateTime";

export const CronjobsTemplate: React.FC = () => {
  const { t, i18n } = useTranslation();

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
            {t("Add Cronjob")}
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
              <TableHeader>{t("Enabled")}</TableHeader>
              <TableHeader>CronTab</TableHeader>
              <TableHeader>{t("Last run")}</TableHeader>
              <TableHeader>{t("Next run")}</TableHeader>
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
                  <div className={clsx(styles[cronjob.status === true ? "statusOk" : "statusFailed"])}>
                    <ToolTip tooltip="Status">
                      <Tag
                        layoutClassName={styles.tagWidth}
                        icon={<FontAwesomeIcon icon={cronjob.status === true ? faCheck : faXmark} />}
                        label={cronjob.status?.toString() ?? "no status"}
                      />
                    </ToolTip>
                  </div>
                </TableCell>
                <TableCell>{cronjob.isEnabled ? "Yes" : "No"}</TableCell>
                <TableCell>{cronjob.crontab}</TableCell>
                <TableCell>{dateTime(t(i18n.language), cronjob.lastRun) ?? "-"}</TableCell>
                <TableCell>{dateTime(t(i18n.language), cronjob.nextRun) ?? "-"}</TableCell>

                <TableCell>{translateDate(i18n.language, cronjob.dateCreated)}</TableCell>
                <TableCell>{translateDate(i18n.language, cronjob.dateMo)}</TableCell>
                <TableCell onClick={() => navigate(`/cronjobs/${cronjob.id}`)}>
                  <Link icon={<ArrowRightIcon />} iconAlign="start">
                    {t("Details")}
                  </Link>
                </TableCell>
              </TableRow>
            ))}
            {!getCronjobs.data.length && (
              <TableRow>
                <TableCell>{t("No cronjobs found")}</TableCell>
                <TableCell />
                <TableCell />
                <TableCell />
                <TableCell />
                <TableCell />
                <TableCell />
                <TableCell />
                <TableCell />
                <TableCell />
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}

      {getCronjobs.isLoading && <Skeleton height="200px" />}
    </Container>
  );
};

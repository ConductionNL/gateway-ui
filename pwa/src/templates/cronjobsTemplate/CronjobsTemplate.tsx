import * as React from "react";
import * as styles from "./CronjobsTemplate.module.css";
import { Button, Heading1, Link } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@gemeente-denhaag/table";
import { useQueryClient } from "react-query";
import { useCronjob } from "../../hooks/cronjob";
import { navigate } from "gatsby";
import { Container, Tag } from "@conduction/components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faPlus } from "@fortawesome/free-solid-svg-icons";
import Skeleton from "react-loading-skeleton";
import clsx from "clsx";
import { translateDate } from "../../services/dateFormat";
import { dateTime } from "../../services/dateTime";

export const CronjobsTemplate: React.FC = () => {
  const { t, i18n } = useTranslation();

  const queryClient = useQueryClient();
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
                  <div
                    className={clsx(
                      cronjob.status ? styles.statusOk : "",
                      cronjob.status === false ? styles.statusFailed : "",
                      cronjob.status === undefined ? styles.statusUnknown : "",
                    )}
                  >
                    <Tag label={cronjob.status?.toString() ?? "Unknown"} />
                  </div>
                </TableCell>

                <TableCell>{cronjob.isEnabled ? "Yes" : "No"}</TableCell>

                <TableCell>{cronjob.crontab}</TableCell>

                <TableCell>{dateTime(t(i18n.language), cronjob.lastRun) ?? "-"}</TableCell>

                <TableCell>{dateTime(t(i18n.language), cronjob.nextRun) ?? "-"}</TableCell>

                <TableCell>{translateDate(i18n.language, cronjob.dateCreated)}</TableCell>

                <TableCell>{translateDate(i18n.language, cronjob.dateMo)}</TableCell>

                <TableCell onClick={() => navigate(`/cronjobs/${cronjob.id}`)}>
                  <Link icon={<FontAwesomeIcon icon={faArrowRight} />} iconAlign="start">
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
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}

      {getCronjobs.isLoading && <Skeleton height="200px" />}
    </Container>
  );
};

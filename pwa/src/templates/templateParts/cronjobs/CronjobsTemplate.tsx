import * as React from "react";
import * as styles from "./CronjobTemplate.module.css";
import { Heading1 } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@gemeente-denhaag/table";
import { QueryClient } from "react-query";
import { useCronjob } from "../../../hooks/cronjob";
import { navigate } from "gatsby";
import { Container } from "@conduction/components";

export const CronjobsTemplate: React.FC = () => {
  const { t } = useTranslation();

  const queryClient = new QueryClient();
  const _useCronjob = useCronjob(queryClient);
  const getCronjobs = _useCronjob.getAll();

  return (
    <Container layoutClassName={styles.container}>
      <Heading1>{t("Cronjobs")}</Heading1>

      {getCronjobs.isLoading && "Loading..."}
      {getCronjobs.isError && "Error..."}

      {getCronjobs.isSuccess && (
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>{t("Name")}</TableHeader>
              <TableHeader>{t("Active")}</TableHeader>
              <TableHeader>Cron tab</TableHeader>
              <TableHeader>{t("Last run")}</TableHeader>
              <TableHeader>{t("Next run")}</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader>{t("Date created")}</TableHeader>
              <TableHeader>{t("Date modified")}</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {getCronjobs.data.map((cronjob) => (
              <TableRow onClick={() => navigate(`/cronjobs/${cronjob.id}`)} key={cronjob.id}>
                <TableCell>{cronjob.name}</TableCell>
                <TableCell>-</TableCell>
                <TableCell>{cronjob.crontab}</TableCell>
                <TableCell>{cronjob.lastRun}</TableCell>
                <TableCell>{cronjob.nextRun}</TableCell>
                <TableCell>-</TableCell>
                <TableCell>-</TableCell>
                <TableCell>-</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Container>
  );
};

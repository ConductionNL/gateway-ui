import * as React from "react";
import * as styles from "./LogsTemplate.module.css";
import { Heading1, Link } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from "@gemeente-denhaag/table";
import { navigate } from "gatsby";
import { QueryClient } from "react-query";
import { Container } from "@conduction/components";
import Skeleton from "react-loading-skeleton";
import { ArrowRightIcon } from "@gemeente-denhaag/icons";
import { useLog } from "../../../hooks/log";

export const LogsTemplate: React.FC = () => {
  const { t } = useTranslation();

  const queryClient = new QueryClient();
  const _useLog = useLog(queryClient);
  const getLog = _useLog.getAll();

  return (
    <Container layoutClassName={styles.container}>
      <Heading1>{t("Logs")}</Heading1>

      {getLog.isError && "Error..."}

      {getLog.isSuccess && (
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>{t("Id")}</TableHeader>
              <TableHeader></TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {getLog.data.map((log) => (
              <TableRow className={styles.tableRow} onClick={() => navigate(`/logs/${log.id}`)} key={log.id}>
                <TableCell>{log.id ?? "-"}</TableCell>
                <TableCell onClick={() => navigate(`/logs/${log.id}`)}>
                  <Link className={styles.detailsLink} icon={<ArrowRightIcon />} iconAlign="start">
                    {t("Details")}
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {getLog.isLoading && <Skeleton height="200px" />}
    </Container>
  );
};

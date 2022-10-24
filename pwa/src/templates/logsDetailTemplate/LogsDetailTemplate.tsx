import * as React from "react";
import * as styles from "./LogsDetailTemplate.module.css";
import { Heading1 } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { QueryClient } from "react-query";
import { Container } from "@conduction/components";
import { Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from "@gemeente-denhaag/table";
import Skeleton from "react-loading-skeleton";
import { useLog } from "../../hooks/log";

interface LogsDetailTemplateProps {
  logId: string;
}

export const LogsDetailTemplate: React.FC<LogsDetailTemplateProps> = ({ logId }) => {
  const { t } = useTranslation();

  const queryClient = new QueryClient();
  const _useLogs = useLog(queryClient);
  const getLogs = _useLogs.getOne(logId);

  return (
    <Container layoutClassName={styles.container}>
      <Heading1>{t("Logs detail page")}</Heading1>

      {getLogs.isError && "Error..."}

      {getLogs.isSuccess && (
        <div className={styles.container}>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>{t("Id")}</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>{getLogs.data.id ?? "-"}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      )}

      {getLogs.isLoading && <Skeleton height="200px" />}
    </Container>
  );
};

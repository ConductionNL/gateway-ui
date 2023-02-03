import * as React from "react";
import * as styles from "./LogsTemplate.module.css";
import { Button, Heading1 } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from "@gemeente-denhaag/table";
import { navigate } from "gatsby";
import { QueryClient } from "react-query";
import { Container, Tag, ToolTip } from "@conduction/components";
import Skeleton from "react-loading-skeleton";
import { useLog } from "../../hooks/log";
import { LogFiltersTemplate } from "../templateParts/logFilters/LogFiltersTemplate";
import { TEMPORARY_LOGS } from "./data";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

export const LogsTemplate: React.FC = () => {
  const { t } = useTranslation();

  const queryClient = new QueryClient();
  const getLogs = useLog(queryClient).getAll();

  const handleResourceClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.TouchEvent<HTMLButtonElement>,
    path: string,
    id: string,
  ) => {
    e.stopPropagation();

    navigate(`/${path}/${id}`);
  };

  return (
    <Container layoutClassName={styles.container}>
      <Heading1>{t("Logs")}</Heading1>

      <LogFiltersTemplate />

      {getLogs.isSuccess && (
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>{t("Level")}</TableHeader>
              <TableHeader>{t("Message")}</TableHeader>
              <TableHeader>{t("Endpoint")}</TableHeader>
              <TableHeader>{t("Schema")}</TableHeader>
              <TableHeader>{t("Cronjob")}</TableHeader>
              <TableHeader>{t("Action")}</TableHeader>
              <TableHeader>{t("User")}</TableHeader>
              <TableHeader>{t("Organization")}</TableHeader>
              <TableHeader>{t("Application")}</TableHeader>
            </TableRow>
          </TableHead>

          <TableBody>
            {TEMPORARY_LOGS.map((log) => (
              <TableRow
                className={styles.tableRow}
                onClick={() => navigate(`/logs/${log._id.$oid}`)}
                key={log._id.$oid}
              >
                <TableCell>
                  <Tag label={log.level_name} />
                </TableCell>

                <TableCell>
                  <ToolTip tooltip={log.message}>
                    <div className={styles.message}>{log.message}</div>
                  </ToolTip>
                </TableCell>

                <TableCell>
                  <Button
                    className={styles.button}
                    disabled={!log.context.endpoint}
                    onClick={(e) => handleResourceClick(e, "endpoints", log.context.endpoint)}
                  >
                    <FontAwesomeIcon icon={faArrowRight} />
                    {t("Endpoint")}
                  </Button>
                </TableCell>

                <TableCell>
                  <Button
                    className={styles.button}
                    disabled={!log.context.schema}
                    onClick={(e) => handleResourceClick(e, "schemas", log.context.schema)}
                  >
                    <FontAwesomeIcon icon={faArrowRight} />
                    {t("Schema")}
                  </Button>
                </TableCell>

                <TableCell>
                  <Button
                    className={styles.button}
                    disabled={!log.context.cronjob}
                    onClick={(e) => handleResourceClick(e, "cronjobs", log.context.cronjob)}
                  >
                    <FontAwesomeIcon icon={faArrowRight} />
                    {t("Cronjob")}
                  </Button>
                </TableCell>

                <TableCell>
                  <Button
                    className={styles.button}
                    disabled={!log.context.action}
                    onClick={(e) => handleResourceClick(e, "actions", log.context.action)}
                  >
                    <FontAwesomeIcon icon={faArrowRight} />
                    {t("Action")}
                  </Button>
                </TableCell>

                <TableCell>
                  <Button
                    className={styles.button}
                    disabled={!log.context.user}
                    onClick={(e) => handleResourceClick(e, "settings/users", log.context.user)}
                  >
                    <FontAwesomeIcon icon={faArrowRight} />
                    {t("User")}
                  </Button>
                </TableCell>

                <TableCell>
                  <Button
                    className={styles.button}
                    disabled={!log.context.organization}
                    onClick={(e) => handleResourceClick(e, "settings/organizations", log.context.organization)}
                  >
                    <FontAwesomeIcon icon={faArrowRight} />
                    {t("Organization")}
                  </Button>
                </TableCell>

                <TableCell>
                  <Button
                    className={styles.button}
                    disabled={!log.context.application}
                    onClick={(e) => handleResourceClick(e, "settings/applications", log.context.application)}
                  >
                    <FontAwesomeIcon icon={faArrowRight} />
                    {t("Application")}
                  </Button>
                </TableCell>
              </TableRow>
            ))}

            {/* {!getLogs.data.length && (
              <TableRow>
                <TableCell>{t("No logs found")}</TableCell>
                <TableCell />
              </TableRow>
            )} */}
          </TableBody>
        </Table>
      )}

      {getLogs.isError && "Error..."}
      {getLogs.isLoading && <Skeleton height="200px" />}
    </Container>
  );
};

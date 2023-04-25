import * as React from "react";
import * as styles from "./LogsTableTemplate.module.css";
import _ from "lodash";
import { navigate } from "gatsby";
import { ToolTip } from "@conduction/components";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from "@gemeente-denhaag/table";
import { Paginate } from "../../../components/paginate/Paginate";
import { useLogFiltersContext } from "../../../context/logs";
import { useTranslation } from "react-i18next";
import { StatusTag, TStatusTagType } from "../../../components/statusTag/StatusTag";
import { Button } from "../../../components/button/Button";
import { DisplayFilters } from "../displayFilters/DisplayFilters";
import { useTableColumnsContext } from "../../../context/tableColumns";
import { TotalResultsSpan } from "../../../components/totalResultsSpan/TotalResultsSpan";

interface LogsTableTemplateProps {
  logs: any[];
  pagination: {
    totalPages: number;
    currentPage: number;
    changePage: React.Dispatch<React.SetStateAction<number>>;
  };
}

export const LogsTableTemplate: React.FC<LogsTableTemplateProps> = ({ logs, pagination }) => {
  const { t } = useTranslation();
  const {
    columns: { logColumns },
    setColumns,
  } = useTableColumnsContext();
  const { logFilters, toggleOrder } = useLogFiltersContext();

  const handleResourceClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.TouchEvent<HTMLButtonElement>,
    path: string,
    id: string,
  ) => {
    e.stopPropagation();

    navigate(`/${path}/${id}`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <DisplayFilters
          columnType="logColumns"
          sortOrder={logFilters["_order[datetime]"]}
          toggleSortOrder={toggleOrder}
          tableColumns={logColumns}
          setTableColumns={setColumns}
        />
        <TotalResultsSpan total={pagination.totalPages * 15} count={15} offset={15 * (pagination.currentPage - 1)} />
      </div>

      <Table>
        <TableHead>
          <TableRow>
            {logColumns.level && <TableHeader>{t("Level")}</TableHeader>}
            {logColumns.message && <TableHeader>{t("Message")}</TableHeader>}
            {logColumns.endpoint && <TableHeader>{t("Endpoint")}</TableHeader>}
            {logColumns.schema && <TableHeader>{t("Schema")}</TableHeader>}
            {logColumns.cronjob && <TableHeader>{t("Cronjob")}</TableHeader>}
            {logColumns.action && <TableHeader>{t("Action")}</TableHeader>}
            {logColumns.user && <TableHeader>{t("User")}</TableHeader>}
            {logColumns.organization && <TableHeader>{t("Organization")}</TableHeader>}
            {logColumns.application && <TableHeader>{t("Application")}</TableHeader>}
          </TableRow>
        </TableHead>

        <TableBody>
          {logs.map((log: any) => (
            <TableRow onClick={() => navigate(`/logs/${log._id.$oid}`)} key={log._id.$oid}>
              {logColumns.level && (
                <TableCell>
                  <StatusTag
                    type={_.lowerCase(log.level_name) as TStatusTagType}
                    label={_.upperFirst(_.lowerCase(log.level_name))}
                  />
                </TableCell>
              )}

              {logColumns.message && (
                <TableCell>
                  <ToolTip tooltip={log.message}>
                    <div className={styles.message}>{log.message}</div>
                  </ToolTip>
                </TableCell>
              )}

              {logColumns.endpoint && (
                <TableCell>
                  <Button
                    variant="primary"
                    label={t("Endpoint")}
                    icon={faArrowRight}
                    className={styles.button}
                    disabled={!log.context.endpoint}
                    onClick={(e) => handleResourceClick(e, "endpoints", log.context.endpoint)}
                  />
                </TableCell>
              )}

              {logColumns.schema && (
                <TableCell>
                  <Button
                    variant="primary"
                    label={t("Schema")}
                    icon={faArrowRight}
                    className={styles.button}
                    disabled={!log.context.schema}
                    onClick={(e) => handleResourceClick(e, "schemas", log.context.schema)}
                  />
                </TableCell>
              )}

              {logColumns.cronjob && (
                <TableCell>
                  <Button
                    variant="primary"
                    label={t("Cronjob")}
                    icon={faArrowRight}
                    className={styles.button}
                    disabled={!log.context.cronjob}
                    onClick={(e) => handleResourceClick(e, "cronjobs", log.context.cronjob)}
                  />
                </TableCell>
              )}

              {logColumns.action && (
                <TableCell>
                  <Button
                    variant="primary"
                    label={t("Action")}
                    icon={faArrowRight}
                    className={styles.button}
                    disabled={!log.context.action}
                    onClick={(e) => handleResourceClick(e, "actions", log.context.action)}
                  />
                </TableCell>
              )}

              {logColumns.user && (
                <TableCell>
                  <Button
                    variant="primary"
                    label={t("User")}
                    icon={faArrowRight}
                    className={styles.button}
                    disabled={!log.context.user}
                    onClick={(e) => handleResourceClick(e, "settings/users", log.context.user)}
                  />
                </TableCell>
              )}

              {logColumns.organization && (
                <TableCell>
                  <Button
                    variant="primary"
                    label={t("Organization")}
                    icon={faArrowRight}
                    className={styles.button}
                    disabled={!log.context.organization}
                    onClick={(e) => handleResourceClick(e, "settings/organizations", log.context.organization)}
                  />
                </TableCell>
              )}

              {logColumns.application && (
                <TableCell>
                  <Button
                    variant="primary"
                    label={t("Application")}
                    icon={faArrowRight}
                    className={styles.button}
                    disabled={!log.context.application}
                    onClick={(e) => handleResourceClick(e, "settings/applications", log.context.application)}
                  />
                </TableCell>
              )}
            </TableRow>
          ))}

          {!logs.length && (
            <TableRow>
              {Object.values(logColumns)
                .filter((value) => value)
                .map((_, idx) => (
                  <TableCell key={idx}>{idx === 0 && <>No logs found</>}</TableCell>
                ))}
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Paginate layoutClassName={styles.pagination} {...pagination} />
    </div>
  );
};

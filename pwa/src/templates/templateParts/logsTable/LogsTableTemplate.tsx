import * as React from "react";
import * as styles from "./LogsTableTemplate.module.css";

import _ from "lodash";
import { navigate } from "gatsby";
import { ToolTip } from "@conduction/components";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from "@gemeente-denhaag/table";
import { Paginate } from "../../../components/paginate/Paginate";
import { useLogFiltersContext, useLogTableColumnsContext } from "../../../context/logs";
import { useTranslation } from "react-i18next";
import { StatusTag, TStatusTagType } from "../../../components/statusTag/StatusTag";
import { Button } from "../../../components/button/Button";
import { DisplayFilters } from "../displayFilters/DisplayFilters";

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
  const { logTableColumns, setLogTableColumns } = useLogTableColumnsContext();
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
          sortOrder={logFilters["_order[datetime]"]}
          toggleSortOrder={toggleOrder}
          tableColumns={logTableColumns}
          setTableColumns={setLogTableColumns}
        />
      </div>

      <Table>
        <TableHead>
          <TableRow>
            {logTableColumns.level && <TableHeader>{t("Level")}</TableHeader>}
            {logTableColumns.message && <TableHeader>{t("Message")}</TableHeader>}
            {logTableColumns.endpoint && <TableHeader>{t("Endpoint")}</TableHeader>}
            {logTableColumns.schema && <TableHeader>{t("Schema")}</TableHeader>}
            {logTableColumns.cronjob && <TableHeader>{t("Cronjob")}</TableHeader>}
            {logTableColumns.action && <TableHeader>{t("Action")}</TableHeader>}
            {logTableColumns.user && <TableHeader>{t("User")}</TableHeader>}
            {logTableColumns.organization && <TableHeader>{t("Organization")}</TableHeader>}
            {logTableColumns.application && <TableHeader>{t("Application")}</TableHeader>}
          </TableRow>
        </TableHead>

        <TableBody>
          {logs.map((log: any) => (
            <TableRow onClick={() => navigate(`/logs/${log._id.$oid}`)} key={log._id.$oid}>
              {logTableColumns.level && (
                <TableCell>
                  <StatusTag
                    type={_.lowerCase(log.level_name) as TStatusTagType}
                    label={_.upperFirst(_.lowerCase(log.level_name))}
                  />
                </TableCell>
              )}

              {logTableColumns.message && (
                <TableCell>
                  <ToolTip tooltip={log.message}>
                    <div className={styles.message}>{log.message}</div>
                  </ToolTip>
                </TableCell>
              )}

              {logTableColumns.endpoint && (
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

              {logTableColumns.schema && (
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

              {logTableColumns.cronjob && (
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

              {logTableColumns.action && (
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

              {logTableColumns.user && (
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

              {logTableColumns.organization && (
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

              {logTableColumns.application && (
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
              {Object.values(logTableColumns)
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

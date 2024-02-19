import * as React from "react";
import * as styles from "./LogsTableTemplate.module.css";
import _ from "lodash";
import { navigate } from "gatsby";
import { ToolTip } from "@conduction/components";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from "@gemeente-denhaag/table";
import { useLogFiltersContext } from "../../../context/logs";
import { useTranslation } from "react-i18next";
import { StatusTag, TStatusTagType } from "../../../components/statusTag/StatusTag";
import { Button } from "../../../components/button/Button";
import { DisplayFilters } from "../displayFilters/DisplayFilters";
import { useTableColumnsContext } from "../../../context/tableColumns";
import { formatUnixDateTime } from "../../../services/dateTime";
import { Link } from "@gemeente-denhaag/components-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { usePagination } from "../../../hooks/usePagination";
import clsx from "clsx";

interface LogsTableTemplateProps {
  logs: any[];
  pagination: {
    data: {
      count: number;
      offset: number;
      pages: number;
      total: number;
    };
    currentPage: number;
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  };
  layoutClassName?: string;
}

export const LogsTableTemplate: React.FC<LogsTableTemplateProps> = ({ logs, pagination, layoutClassName }) => {
  const { t, i18n } = useTranslation();
  const {
    columns: { logColumns },
    setColumns,
  } = useTableColumnsContext();
  const { logFilters, toggleOrder } = useLogFiltersContext();

  const { Pagination, PaginationLocationIndicator } = usePagination(
    { ...pagination.data },
    pagination.currentPage,
    pagination.setCurrentPage,
  );

  const handleResourceClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.TouchEvent<HTMLButtonElement>,
    path: string,
    id: string,
  ) => {
    e.stopPropagation();

    navigate(`/${path}/${id}`);
  };

  return (
    <div className={clsx(styles.container, layoutClassName && layoutClassName)}>
      <div className={styles.header}>
        <DisplayFilters
          columnType="logColumns"
          sortOrder={logFilters["_order[datetime]"]}
          toggleSortOrder={toggleOrder}
          tableColumns={logColumns}
          setTableColumns={setColumns}
        />
        <PaginationLocationIndicator />
      </div>

      <div className={styles.tableContainer}>
        <Table>
          <TableHead>
            <TableRow>
              {logColumns.level && <TableHeader>{t("Level")}</TableHeader>}
              {logColumns.message && <TableHeader>{t("Message")}</TableHeader>}
              {logColumns.created && <TableHeader>{t("Created")}</TableHeader>}
              {logColumns.endpoint && <TableHeader>{t("Endpoint")}</TableHeader>}
              {logColumns.schema && <TableHeader>{t("Schema")}</TableHeader>}
              {logColumns.source && <TableHeader>{t("Source")}</TableHeader>}
              {logColumns.cronjob && <TableHeader>{t("Cronjob")}</TableHeader>}
              {logColumns.action && <TableHeader>{t("Action")}</TableHeader>}
              {logColumns.user && <TableHeader>{t("User")}</TableHeader>}
              {logColumns.organization && <TableHeader>{t("Organization")}</TableHeader>}
              {logColumns.application && <TableHeader>{t("Application")}</TableHeader>}
              {logColumns.object && <TableHeader>{t("Object")}</TableHeader>}
              {logColumns.mapping && <TableHeader>{t("Mapping")}</TableHeader>}
              <TableHeader></TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {logs.map((log: any) => (
              <TableRow key={log._id.$oid}>
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

                {logColumns.created && (
                  <TableCell>
                    <ToolTip tooltip={formatUnixDateTime(t(i18n.language), log.datetime.$date.$numberLong)}>
                      <div className={styles.created}>
                        {formatUnixDateTime(t(i18n.language), log.datetime.$date.$numberLong)}
                      </div>
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

                {logColumns.source && (
                  <TableCell>
                    <Button
                      variant="primary"
                      label={t("Source")}
                      icon={faArrowRight}
                      className={styles.button}
                      disabled={!log.context.source}
                      onClick={(e) => handleResourceClick(e, "sources", log.context.source)}
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

                {logColumns.object && (
                  <TableCell>
                    <Button
                      variant="primary"
                      label={t("Object")}
                      icon={faArrowRight}
                      className={styles.button}
                      disabled={!log.context.object}
                      onClick={(e) => handleResourceClick(e, "objects", log.context.object)}
                    />
                  </TableCell>
                )}

                {logColumns.mapping && (
                  <TableCell>
                    <Button
                      variant="primary"
                      label={t("Mapping")}
                      icon={faArrowRight}
                      className={styles.button}
                      disabled={!log.context.mapping}
                      onClick={(e) => handleResourceClick(e, "mappings", log.context.mapping)}
                    />
                  </TableCell>
                )}

                <TableCell onClick={() => navigate(`/logs/${log._id.$oid}`)}>
                  <Link icon={<FontAwesomeIcon icon={faArrowRight} />} iconAlign="start">
                    {t("Details")}
                  </Link>
                </TableCell>
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
      </div>

      <Pagination layoutClassName={styles.pagination} />
    </div>
  );
};

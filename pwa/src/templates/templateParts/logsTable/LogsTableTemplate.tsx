import * as React from "react";
import * as styles from "./LogsTableTemplate.module.css";

import _ from "lodash";
import { t } from "i18next";
import { navigate } from "gatsby";
import { Tag, ToolTip } from "@conduction/components";
import { Button } from "@gemeente-denhaag/components-react";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from "@gemeente-denhaag/table";
import { Paginate } from "../../../components/paginate/Paginate";
import { useLogTableColumnsContext } from "../../../context/logs";

interface LogsTableTemplateProps {
  logs: any[];
  pagination: {
    totalPages: number;
    currentPage: number;
    changePage: React.Dispatch<React.SetStateAction<number>>;
  };
}

export const LogsTableTemplate: React.FC<LogsTableTemplateProps> = ({ logs, pagination }) => {
  const { logTableColumns } = useLogTableColumnsContext();

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
      <LogsTableColumnFilters />

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
            <TableRow className={styles.tableRow} onClick={() => navigate(`/logs/${log._id.$oid}`)} key={log._id.$oid}>
              {logTableColumns.level && (
                <TableCell>
                  <Tag
                    layoutClassName={styles[_.lowerCase(log.level_name)]}
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
                    className={styles.button}
                    disabled={!log.context.endpoint}
                    onClick={(e) => handleResourceClick(e, "endpoints", log.context.endpoint)}
                  >
                    <FontAwesomeIcon icon={faArrowRight} />
                    {t("Endpoint")}
                  </Button>
                </TableCell>
              )}

              {logTableColumns.schema && (
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
              )}

              {logTableColumns.cronjob && (
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
              )}

              {logTableColumns.action && (
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
              )}

              {logTableColumns.user && (
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
              )}

              {logTableColumns.organization && (
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
              )}

              {logTableColumns.application && (
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
              )}
            </TableRow>
          ))}

          {!logs.length && (
            <TableRow>
              <TableCell>{t("No logs found")}</TableCell>
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

      <Paginate {...pagination} />
    </div>
  );
};

const LogsTableColumnFilters: React.FC = () => {
  const { setLogTableColumns, logTableColumns } = useLogTableColumnsContext();

  const handleColumnToggle = (key: string, checked: boolean) => {
    setLogTableColumns({ [key]: checked });
  };

  return (
    <div className={styles.columnFiltersContainer}>
      {Object.entries(logTableColumns).map(([key, value]) => (
        <div {...{ key }}>
          <label htmlFor={key}>{_.upperFirst(key)}</label>
          <input onChange={() => handleColumnToggle(key, !value)} type="checkbox" id={key} name={key} checked={value} />
        </div>
      ))}
    </div>
  );
};

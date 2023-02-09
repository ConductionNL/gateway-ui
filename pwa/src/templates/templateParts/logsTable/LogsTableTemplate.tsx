import * as React from "react";
import * as styles from "./LogsTableTemplate.module.css";

import _ from "lodash";
import { t } from "i18next";
import { navigate } from "gatsby";
import { Tag, ToolTip } from "@conduction/components";
import { Button, FormField, FormFieldInput, FormFieldLabel } from "@gemeente-denhaag/components-react";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from "@gemeente-denhaag/table";
import { Paginate } from "../../../components/paginate/Paginate";

interface LogsTableTemplateProps {
  logs: any[];
  pagination: {
    totalPages: number;
    currentPage: number;
    changePage: React.Dispatch<React.SetStateAction<number>>;
  };
}

export const LogsTableTemplate: React.FC<LogsTableTemplateProps> = ({ logs, pagination }) => {
  const [visibleColumns, setVisibleColumns] = React.useState<any>({
    level: true,
    message: true,
    endpoint: true,
    schema: true,
    cronjob: true,
    action: true,
    user: true,
    organization: true,
    application: true,
  });

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
      <div className={styles.columnFiltersContainer}>
        <FormField>
          <FormFieldInput>
            <input
              type="checkbox"
              id="level"
              checked={visibleColumns.level}
              onChange={(e) => setVisibleColumns((columns: any) => ({ ...columns, level: e.target.checked }))}
            />
            <FormFieldLabel htmlFor="level">{t("Level")}</FormFieldLabel>
          </FormFieldInput>
        </FormField>

        <FormField>
          <FormFieldInput>
            <input
              type="checkbox"
              id="message"
              checked={visibleColumns.message}
              onChange={(e) => setVisibleColumns((columns: any) => ({ ...columns, message: e.target.checked }))}
            />
            <FormFieldLabel htmlFor="message">{t("Message")}</FormFieldLabel>
          </FormFieldInput>
        </FormField>

        <FormField>
          <FormFieldInput>
            <input
              type="checkbox"
              id="endpoint"
              checked={visibleColumns.endpoint}
              onChange={(e) => setVisibleColumns((columns: any) => ({ ...columns, endpoint: e.target.checked }))}
            />
            <FormFieldLabel htmlFor="endpoint">{t("Endpoint")}</FormFieldLabel>
          </FormFieldInput>
        </FormField>

        <FormField>
          <FormFieldInput>
            <input
              type="checkbox"
              id="schema"
              checked={visibleColumns.schema}
              onChange={(e) => setVisibleColumns((columns: any) => ({ ...columns, schema: e.target.checked }))}
            />
            <FormFieldLabel htmlFor="schema">{t("Schema")}</FormFieldLabel>
          </FormFieldInput>
        </FormField>

        <FormField>
          <FormFieldInput>
            <input
              type="checkbox"
              id="cronjob"
              checked={visibleColumns.cronjob}
              onChange={(e) => setVisibleColumns((columns: any) => ({ ...columns, cronjob: e.target.checked }))}
            />
            <FormFieldLabel htmlFor="cronjob">{t("Cronjob")}</FormFieldLabel>
          </FormFieldInput>
        </FormField>

        <FormField>
          <FormFieldInput>
            <input
              type="checkbox"
              id="action"
              checked={visibleColumns.action}
              onChange={(e) => setVisibleColumns((columns: any) => ({ ...columns, action: e.target.checked }))}
            />
            <FormFieldLabel htmlFor="action">{t("Action")}</FormFieldLabel>
          </FormFieldInput>
        </FormField>

        <FormField>
          <FormFieldInput>
            <input
              type="checkbox"
              id="user"
              checked={visibleColumns.user}
              onChange={(e) => setVisibleColumns((columns: any) => ({ ...columns, user: e.target.checked }))}
            />
            <FormFieldLabel htmlFor="user">{t("User")}</FormFieldLabel>
          </FormFieldInput>
        </FormField>

        <FormField>
          <FormFieldInput>
            <input
              type="checkbox"
              id="organization"
              checked={visibleColumns.organization}
              onChange={(e) => setVisibleColumns((columns: any) => ({ ...columns, organization: e.target.checked }))}
            />
            <FormFieldLabel htmlFor="organization">{t("Organization")}</FormFieldLabel>
          </FormFieldInput>
        </FormField>

        <FormField>
          <FormFieldInput>
            <input
              type="checkbox"
              id="application"
              checked={visibleColumns.application}
              onChange={(e) => setVisibleColumns((columns: any) => ({ ...columns, application: e.target.checked }))}
            />
            <FormFieldLabel htmlFor="application">{t("Application")}</FormFieldLabel>
          </FormFieldInput>
        </FormField>
      </div>

      <Table>
        <TableHead>
          <TableRow>
            {visibleColumns.level && <TableHeader>{t("Level")}</TableHeader>}
            {visibleColumns.message && <TableHeader>{t("Message")}</TableHeader>}
            {visibleColumns.endpoint && <TableHeader>{t("Endpoint")}</TableHeader>}
            {visibleColumns.schema && <TableHeader>{t("Schema")}</TableHeader>}
            {visibleColumns.cronjob && <TableHeader>{t("Cronjob")}</TableHeader>}
            {visibleColumns.action && <TableHeader>{t("Action")}</TableHeader>}
            {visibleColumns.user && <TableHeader>{t("User")}</TableHeader>}
            {visibleColumns.organization && <TableHeader>{t("Organization")}</TableHeader>}
            {visibleColumns.application && <TableHeader>{t("Application")}</TableHeader>}
          </TableRow>
        </TableHead>

        <TableBody>
          {logs.map((log: any) => (
            <TableRow className={styles.tableRow} onClick={() => navigate(`/logs/${log._id.$oid}`)} key={log._id.$oid}>
              {visibleColumns.level && (
                <TableCell>
                  <Tag
                    layoutClassName={styles[_.lowerCase(log.level_name)]}
                    label={_.upperFirst(_.lowerCase(log.level_name))}
                  />
                </TableCell>
              )}

              {visibleColumns.message && (
                <TableCell>
                  <ToolTip tooltip={log.message}>
                    <div className={styles.message}>{log.message}</div>
                  </ToolTip>
                </TableCell>
              )}

              {visibleColumns.endpoint && (
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

              {visibleColumns.schema && (
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

              {visibleColumns.cronjob && (
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

              {visibleColumns.action && (
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

              {visibleColumns.user && (
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

              {visibleColumns.organization && (
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

              {visibleColumns.application && (
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
              {Array.from({ length: Object.values(visibleColumns).filter((column) => column === true).length }, () => (
                <TableCell />
              ))}
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Paginate {...pagination} />
    </div>
  );
};

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

interface LogsTableTemplateProps {
  logs: any[];
  pagination: {
    totalPages: number;
    currentPage: number;
    changePage: React.Dispatch<React.SetStateAction<number>>;
  };
}

export const LogsTableTemplate: React.FC<LogsTableTemplateProps> = ({ logs, pagination }) => {
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
          {logs.map((log: any) => (
            <TableRow className={styles.tableRow} onClick={() => navigate(`/logs/${log._id.$oid}`)} key={log._id.$oid}>
              <TableCell>
                <Tag
                  layoutClassName={styles[_.lowerCase(log.level_name)]}
                  label={_.upperFirst(_.lowerCase(log.level_name))}
                />
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

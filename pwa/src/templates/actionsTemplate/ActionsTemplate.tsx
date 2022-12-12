import * as React from "react";
import * as styles from "./ActionsTemplate.module.css";
import { Button, Heading1, Link } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { useAction } from "../../hooks/action";
import { Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from "@gemeente-denhaag/table";
import { navigate } from "gatsby";
import { QueryClient } from "react-query";
import { Container, Tag, ToolTip } from "@conduction/components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ArrowRightIcon } from "@gemeente-denhaag/icons";
import { faCheck, faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import clsx from "clsx";
import { translateDate } from "../../services/dateFormat";
import Skeleton from "react-loading-skeleton";

export const ActionsTemplate: React.FC = () => {
  const { t, i18n } = useTranslation();

  const queryClient = new QueryClient();
  const _useActions = useAction(queryClient);
  const getActions = _useActions.getAll();

  return (
    <Container layoutClassName={styles.container}>
      <section className={styles.section}>
        <Heading1>{t("Actions")}</Heading1>
        <div className={styles.buttons}>
          <Button className={styles.buttonIcon} onClick={() => navigate(`/actions/new`)}>
            <FontAwesomeIcon icon={faPlus} />
            {t("Add Action")}
          </Button>
        </div>
      </section>

      {getActions.isError && "Error..."}

      {getActions.isSuccess && (
        <div>
          <Table className={styles.table}>
            <TableHead>
              <TableRow>
                <TableHeader>Name</TableHeader>
                <TableHeader>Priority</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader>Active</TableHeader>
                <TableHeader>Last run</TableHeader>
                <TableHeader>Last run time</TableHeader>
                <TableHeader>Date Created</TableHeader>
                <TableHeader>Date Modified</TableHeader>
                <TableHeader className={styles.details} />
              </TableRow>
            </TableHead>
            <TableBody>
              {getActions.data.map((action) => (
                <TableRow onClick={() => navigate(`/actions/${action.id}`)} key={action.id} className={styles.tableRow}>
                  <TableCell className={styles.actionName}>{action.name}</TableCell>
                  <TableCell>{action.priority}</TableCell>
                  <TableCell>
                    <div className={clsx(styles[action.status === true ? "statusOk" : "statusFailed"])}>
                      <ToolTip tooltip="Status">
                        <Tag
                          layoutClassName={styles.tagWidth}
                          icon={<FontAwesomeIcon icon={action.status === true ? faCheck : faXmark} />}
                          label={action.status?.toString() ?? "no status"}
                        />
                      </ToolTip>
                    </div>
                  </TableCell>
                  <TableCell>{action.isActive ? "On" : "Off"}</TableCell>
                  <TableCell>{action.lastRun ?? "-"}</TableCell>
                  <TableCell>{`${action.lastRunTime}ms` ?? "-"}</TableCell>
                  <TableCell>{translateDate(i18n.language, action.dateCreated) ?? "-"}</TableCell>
                  <TableCell>{translateDate(i18n.language, action.dateModified) ?? "-"}</TableCell>
                  <TableCell className={styles.details} onClick={() => navigate(`/actions/${action.id}`)}>
                    <Link icon={<ArrowRightIcon />} iconAlign="start">
                      {t("Details")}
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
              {!getActions.data.length && (
                <TableRow>
                  <TableCell>{t("No actions found")}</TableCell>
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
        </div>
      )}

      {getActions.isLoading && <Skeleton height="200px" />}
    </Container>
  );
};

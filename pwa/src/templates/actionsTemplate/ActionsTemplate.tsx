import * as React from "react";
import * as styles from "./ActionsTemplate.module.css";
import { Link } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { useAction } from "../../hooks/action";
import { Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from "@gemeente-denhaag/table";
import { navigate } from "gatsby";
import { useQueryClient } from "react-query";
import { Container, Tag, ToolTip } from "@conduction/components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faCheck, faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import clsx from "clsx";
import { translateDate } from "../../services/dateFormat";
import Skeleton from "react-loading-skeleton";
import { Button } from "../../components/button/Button";
import { OverviewPageHeaderTemplate } from "../templateParts/overviewPageHeader/OverviewPageHeaderTemplate";

export const ActionsTemplate: React.FC = () => {
  const { t, i18n } = useTranslation();

  const queryClient = useQueryClient();
  const _useActions = useAction(queryClient);
  const getActions = _useActions.getAll();

  return (
    <Container layoutClassName={styles.container}>
      <OverviewPageHeaderTemplate
        title={t("Actions")}
        button={
          <Button label={t("Add Action")} icon={faPlus} variant="primary" onClick={() => navigate("/actions/new")} />
        }
      />

      {getActions.isError && "Error..."}

      {getActions.isSuccess && (
        <div>
          <Table className={styles.table}>
            <TableHead>
              <TableRow>
                <TableHeader>Name</TableHeader>
                <TableHeader>Priority</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader>Enabled</TableHeader>
                <TableHeader>Last run</TableHeader>
                <TableHeader>Last run time</TableHeader>
                <TableHeader>Date Created</TableHeader>
                <TableHeader>Date Modified</TableHeader>
                <TableHeader className={styles.details} />
              </TableRow>
            </TableHead>
            <TableBody>
              {getActions.data.map((action) => (
                <TableRow onClick={() => navigate(`/actions/${action.id}`)} key={action.id}>
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
                  <TableCell>{action.isEnabled ? "On" : "Off"}</TableCell>
                  <TableCell>{action.lastRun ?? "-"}</TableCell>
                  <TableCell>{`${action.lastRunTime}ms` ?? "-"}</TableCell>
                  <TableCell>{translateDate(i18n.language, action.dateCreated) ?? "-"}</TableCell>
                  <TableCell>{translateDate(i18n.language, action.dateModified) ?? "-"}</TableCell>
                  <TableCell className={styles.details} onClick={() => navigate(`/actions/${action.id}`)}>
                    <Link icon={<FontAwesomeIcon icon={faArrowRight} />} iconAlign="start">
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

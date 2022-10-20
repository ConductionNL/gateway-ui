import * as React from "react";
import * as styles from "./ActionTemplate.module.css";
import { Button, Heading1, Link } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { useAction } from "../../../hooks/action";
import { Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from "@gemeente-denhaag/table";
import { navigate } from "gatsby";
import { QueryClient } from "react-query";
import { Container, Tag } from "@conduction/components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ArrowRightIcon } from "@gemeente-denhaag/icons";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import clsx from "clsx";
import { translateDate } from "../../../services/dateFormat";
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
            {t("Add")}
          </Button>
        </div>
      </section>

      {getActions.isError && "Error..."}

      {getActions.isSuccess && (
        <Table>
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
              <TableHeader />
            </TableRow>
          </TableHead>
          <TableBody>
            {getActions.data.map((action) => (
              <TableRow onClick={() => navigate(`/actions/${action.id}`)} key={action.id} className={styles.tableRow}>
                <TableCell>{action.name}</TableCell>
                <TableCell>{action.priority}</TableCell>
                <TableCell>
                  <div className={clsx(styles[action.status === "Ok" ? "statusOk" : "statusFailed"])}>
                    <Tag label={action.status.toString() ?? "-"} />
                  </div>
                </TableCell>
                <TableCell>{action.status ? "On" : "Off"}</TableCell>
                <TableCell>{translateDate(i18n.language, action.lastRun) ?? "-"}</TableCell>
                <TableCell>{action.lastRunTime ?? "-"}</TableCell>
                <TableCell>{translateDate(i18n.language, action.dateCreated) ?? "-"}</TableCell>
                <TableCell>{translateDate(i18n.language, action.dateModified) ?? "-"}</TableCell>
                <TableCell onClick={() => navigate(`/actions/${action.id}`)}>
                  <Link className={styles.detailsLink} icon={<ArrowRightIcon />} iconAlign="start">
                    {t("Details")}
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {getActions.isLoading && <Skeleton height="200px" />}
    </Container>
  );
};

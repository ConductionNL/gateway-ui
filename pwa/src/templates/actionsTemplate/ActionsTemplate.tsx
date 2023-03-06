import * as React from "react";
import * as styles from "./ActionsTemplate.module.css";
import { Link } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { useAction } from "../../hooks/action";
import { Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from "@gemeente-denhaag/table";
import { navigate } from "gatsby";
import { useQueryClient } from "react-query";
import { Container } from "@conduction/components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faPlus } from "@fortawesome/free-solid-svg-icons";
import { translateDate } from "../../services/dateFormat";
import Skeleton from "react-loading-skeleton";
import { Button } from "../../components/button/Button";
import { OverviewPageHeaderTemplate } from "../templateParts/overviewPageHeader/OverviewPageHeaderTemplate";
import { dateTime } from "../../services/dateTime";
import { StatusTag } from "../../components/statusTag/StatusTag";
import { useBulkSelect } from "../../hooks/useBulkSelect";
import { BulkActionButton } from "../../components/bulkActionButton/BulkActionButton";

export const ActionsTemplate: React.FC = () => {
  const { t, i18n } = useTranslation();

  const queryClient = useQueryClient();
  const _useActions = useAction(queryClient);
  const getActions = _useActions.getAll();
  const deleteAction = _useActions.remove();

  const { CheckboxBulkSelectAll, CheckboxBulkSelectOne, selectedItems } = useBulkSelect(getActions.data);

  const handleBulkDelete = (): void => {
    selectedItems.forEach((item) => deleteAction.mutate({ id: item }));
  };

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
          <BulkActionButton
            actions={[{ type: "delete", onSubmit: handleBulkDelete }]}
            selectedItemsCount={selectedItems.length}
          />

          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>
                  <CheckboxBulkSelectAll />
                </TableHeader>
                <TableHeader>Name</TableHeader>
                <TableHeader>Priority</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader>Enabled</TableHeader>
                <TableHeader>Last run</TableHeader>
                <TableHeader>Last run time</TableHeader>
                <TableHeader>Date Created</TableHeader>
                <TableHeader>Date Modified</TableHeader>
                <TableHeader />
              </TableRow>
            </TableHead>
            <TableBody>
              {getActions.data.map((action) => (
                <TableRow key={action.id}>
                  <TableCell>{<CheckboxBulkSelectOne id={action.id} />}</TableCell>

                  <TableCell className={styles.actionName}>{action.name}</TableCell>

                  <TableCell>{action.priority}</TableCell>

                  <TableCell>
                    <StatusTag
                      type={action.status ? "success" : "default"}
                      label={action.status ? "Success" : "No status"}
                    />
                  </TableCell>

                  <TableCell>{action.isEnabled ? "On" : "Off"}</TableCell>

                  <TableCell>{action.lastRun ? dateTime(t(i18n.language), action.lastRun) : "-"}</TableCell>

                  <TableCell>{`${action.lastRunTime}ms` ?? "-"}</TableCell>

                  <TableCell>{translateDate(i18n.language, action.dateCreated) ?? "-"}</TableCell>

                  <TableCell>{translateDate(i18n.language, action.dateModified) ?? "-"}</TableCell>

                  <TableCell onClick={() => navigate(`/actions/${action.id}`)}>
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

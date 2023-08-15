import * as React from "react";
import * as styles from "./CronjobsTemplate.module.css";
import { Link } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@gemeente-denhaag/table";
import { useQueryClient } from "react-query";
import { useCronjob } from "../../hooks/cronjob";
import { navigate } from "gatsby";
import { Container } from "@conduction/components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faPlus } from "@fortawesome/free-solid-svg-icons";
import Skeleton from "react-loading-skeleton";
import { translateDate } from "../../services/dateFormat";
import { dateTime } from "../../services/dateTime";
import { Button } from "../../components/button/Button";
import { OverviewPageHeaderTemplate } from "../templateParts/overviewPageHeader/OverviewPageHeaderTemplate";
import { StatusTag } from "../../components/statusTag/StatusTag";
import { useBulkSelect } from "../../hooks/useBulkSelect";
import { BulkActionButton } from "../../components/bulkActionButton/BulkActionButton";
import { ActionButton } from "../../components/actionButton/ActionButton";

export const CronjobsTemplate: React.FC = () => {
  const { t, i18n } = useTranslation();

  const queryClient = useQueryClient();
  const _useCronjob = useCronjob(queryClient);
  const getCronjobs = _useCronjob.getAll();
  const deleteCronjob = _useCronjob.remove();

  const { CheckboxBulkSelectAll, CheckboxBulkSelectOne, selectedItems, toggleItem } = useBulkSelect(getCronjobs.data);

  const handleBulkDelete = (): void => {
    selectedItems.forEach((item) => deleteCronjob.mutate({ id: item }));
  };

  return (
    <Container layoutClassName={styles.container}>
      <OverviewPageHeaderTemplate
        title={t("Cronjobs")}
        button={
          <Button label={t("Add Cronjob")} variant="primary" icon={faPlus} onClick={() => navigate(`/cronjobs/new`)} />
        }
      />

      {getCronjobs.isError && "Error..."}

      {getCronjobs.isSuccess && (
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
                <TableHeader>{t("Name")}</TableHeader>
                <TableHeader>{t("Status")}</TableHeader>
                <TableHeader>{t("Enabled")}</TableHeader>
                <TableHeader>CronTab</TableHeader>
                <TableHeader>{t("Last run")}</TableHeader>
                <TableHeader>{t("Next run")}</TableHeader>
                <TableHeader>{t("Date created")}</TableHeader>
                <TableHeader>{t("Date modified")}</TableHeader>
                <TableHeader>{t("Actions")}</TableHeader>
                <TableHeader></TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {getCronjobs.data.map((cronjob) => (
                <TableRow key={cronjob.id} onClick={() => toggleItem(cronjob.id)}>
                  <TableCell>{<CheckboxBulkSelectOne id={cronjob.id} />}</TableCell>

                  <TableCell>{cronjob.name}</TableCell>

                  <TableCell>
                    {cronjob.status && <StatusTag type="success" label={cronjob.status?.toString()} />}
                    {cronjob.status === false && (
                      <StatusTag type="critical" label={cronjob.status?.toString() ?? "False"} />
                    )}
                    {cronjob.status === undefined && <StatusTag label="No status" />}
                  </TableCell>

                  <TableCell>{cronjob.isEnabled ? "Yes" : "No"}</TableCell>

                  <TableCell>{cronjob.crontab}</TableCell>

                  <TableCell>{cronjob.lastRun ? dateTime(t(i18n.language), cronjob.lastRun) : "-"}</TableCell>

                  <TableCell>{cronjob.nextRun ? dateTime(t(i18n.language), cronjob.nextRun) : "-"}</TableCell>

                  <TableCell>{translateDate(i18n.language, cronjob.dateCreated)}</TableCell>

                  <TableCell>{translateDate(i18n.language, cronjob.dateMo)}</TableCell>

                  <TableCell>
                    <ActionButton
                      actions={[
                        { type: "delete", onSubmit: () => deleteCronjob.mutate({ id: cronjob.id }) },
                        { type: "download", onSubmit: () => undefined, disabled: true },
                      ]}
                      variant="primary"
                    />
                  </TableCell>

                  <TableCell onClick={() => navigate(`/cronjobs/${cronjob.id}`)}>
                    <Link icon={<FontAwesomeIcon icon={faArrowRight} />} iconAlign="start">
                      {t("Details")}
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
              {!getCronjobs.data.length && (
                <TableRow>
                  <TableCell>{t("No cronjobs found")}</TableCell>
                  <TableCell />
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

      {getCronjobs.isLoading && <Skeleton height="200px" />}
    </Container>
  );
};

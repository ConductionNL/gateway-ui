import * as React from "react";
import * as styles from "./DatabasesTemplate.module.css";
import { Link } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@gemeente-denhaag/table";
import { navigate } from "gatsby";
import { Container } from "@conduction/components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useQueryClient } from "react-query";
import { translateDate } from "../../services/dateFormat";
import Skeleton from "react-loading-skeleton";
import { useDatabase } from "../../hooks/database";
import { Button } from "../../components/button/Button";
import { OverviewPageHeaderTemplate } from "../templateParts/overviewPageHeader/OverviewPageHeaderTemplate";
import { useBulkSelect } from "../../hooks/useBulkSelect";
import { BulkActionButton } from "../../components/bulkActionButton/BulkActionButton";

export const DatabasesTemplate: React.FC = () => {
  const { t, i18n } = useTranslation();

  const queryClient = useQueryClient();
  const _useDatabases = useDatabase(queryClient);
  const getDatabases = _useDatabases.getAll();
  const deleteDatabase = _useDatabases.remove();

  const { CheckboxBulkSelectAll, CheckboxBulkSelectOne, selectedItems, toggleItem } = useBulkSelect(getDatabases.data);

  const handleBulkDelete = (): void => {
    selectedItems.forEach((item) => deleteDatabase.mutate({ id: item }));
  };

  return (
    <Container layoutClassName={styles.container}>
      <OverviewPageHeaderTemplate
        title={t("Databases")}
        size="md"
        button={
          <Button
            variant="primary"
            icon={faPlus}
            label={t("Add database")}
            onClick={() => navigate(`/settings/databases/new`)}
          />
        }
      />

      {getDatabases.isSuccess && (
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
                <TableHeader>{t("Organizations")}</TableHeader>
                <TableHeader>{t("Date created")}</TableHeader>
                <TableHeader>{t("Date modified")}</TableHeader>
                <TableHeader />
              </TableRow>
            </TableHead>
            <TableBody>
              {getDatabases.data.map((database: any) => (
                <TableRow key={database.id} onClick={() => toggleItem(database.id)}>
                  <TableCell>{<CheckboxBulkSelectOne id={database.id} />}</TableCell>

                  <TableCell>{database.name}</TableCell>

                  <TableCell>
                    {database.organizations.length > 1
                      ? `${database.organizations.length} organizations`
                      : database.organizations[0]?.name}
                  </TableCell>

                  <TableCell>{translateDate(i18n.language, database.dateCreated) ?? "-"}</TableCell>

                  <TableCell>{translateDate(i18n.language, database.dateModified) ?? "-"}</TableCell>

                  <TableCell onClick={() => navigate(`/settings/databases/${database.id}`)}>
                    <Link icon={<FontAwesomeIcon icon={faArrowRight} />} iconAlign="start">
                      {t("Details")}
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
              {!getDatabases.data.length && (
                <TableRow>
                  <TableCell>No databases found</TableCell>
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

      {getDatabases.isLoading && <Skeleton height={200} />}
    </Container>
  );
};

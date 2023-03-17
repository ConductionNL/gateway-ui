import * as React from "react";
import * as styles from "./MappingsTemplate.module.css";
import { Link } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from "@gemeente-denhaag/table";
import { navigate } from "gatsby";
import { Container } from "@conduction/components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useQueryClient } from "react-query";
import { useMapping } from "../../hooks/mapping";
import Skeleton from "react-loading-skeleton";
import { translateDate } from "../../services/dateFormat";
import { Button } from "../../components/button/Button";
import { OverviewPageHeaderTemplate } from "../templateParts/overviewPageHeader/OverviewPageHeaderTemplate";
import { useBulkSelect } from "../../hooks/useBulkSelect";
import { BulkActionButton } from "../../components/bulkActionButton/BulkActionButton";

export const MappingTemplate: React.FC = () => {
  const { t, i18n } = useTranslation();

  const queryClient = useQueryClient();
  const getMappings = useMapping(queryClient).getAll();
  const deleteMapping = useMapping(queryClient).remove();

  const { CheckboxBulkSelectAll, CheckboxBulkSelectOne, selectedItems } = useBulkSelect(getMappings.data);

  const handleBulkDelete = (): void => {
    selectedItems.forEach((item) => deleteMapping.mutate({ id: item }));
  };

  return (
    <Container layoutClassName={styles.container}>
      <OverviewPageHeaderTemplate
        title={t("Mappings")}
        button={
          <Button label={t("Add Mapping")} icon={faPlus} variant="primary" onClick={() => navigate("/mappings/new")} />
        }
      />

      {getMappings.isLoading && <Skeleton height="200px" />}

      {getMappings.isSuccess && (
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
                <TableHeader>Version</TableHeader>
                <TableHeader>Date Created</TableHeader>
                <TableHeader>Date Modified</TableHeader>
                <TableHeader />
              </TableRow>
            </TableHead>
            <TableBody>
              {getMappings.data.map((mapping) => (
                <TableRow key={mapping.id}>
                  <TableCell>{<CheckboxBulkSelectOne id={mapping.id} />}</TableCell>

                  <TableCell>{mapping.name ?? "-"}</TableCell>

                  <TableCell>{mapping.version ?? "-"}</TableCell>

                  <TableCell>{translateDate(i18n.language, mapping.dateCreated) ?? "-"}</TableCell>

                  <TableCell>{translateDate(i18n.language, mapping.dateModified) ?? "-"}</TableCell>

                  <TableCell className={styles.details} onClick={() => navigate(`/mappings/${mapping.id}`)}>
                    <Link icon={<FontAwesomeIcon icon={faArrowRight} />} iconAlign="start">
                      {t("Details")}
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>

            {!getMappings.data.length && (
              <TableRow>
                <TableCell>{t("No mappings found")}</TableCell>
                <TableCell />
                <TableCell />
                <TableCell />
                <TableCell />
                <TableCell />
              </TableRow>
            )}
          </Table>
        </div>
      )}
    </Container>
  );
};

import * as React from "react";
import * as styles from "./SchemasTemplate.module.css";
import { useTranslation } from "react-i18next";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@gemeente-denhaag/table";
import { useQueryClient } from "react-query";
import { navigate } from "gatsby";
import { Container } from "@conduction/components";
import { faPlus, faGear } from "@fortawesome/free-solid-svg-icons";
import Skeleton from "react-loading-skeleton";
import { useSchema } from "../../hooks/schema";
import { translateDate } from "../../services/dateFormat";
import { useObject } from "../../hooks/object";
import { Button } from "../../components/button/Button";
import { OverviewPageHeaderTemplate } from "../templateParts/overviewPageHeader/OverviewPageHeaderTemplate";
import { useBulkSelect } from "../../hooks/useBulkSelect";
import { BulkActionButton } from "../../components/bulkActionButton/BulkActionButton";

export const SchemasTemplate: React.FC = () => {
  const { t, i18n } = useTranslation();

  const queryClient = useQueryClient();
  const _useSchema = useSchema(queryClient);
  const getSchemas = _useSchema.getAll();
  const deleteSchema = _useSchema.remove();

  const _useObject = useObject(queryClient);
  const getObjects = _useObject.getAll(1, 200);

  const { CheckboxBulkSelectAll, CheckboxBulkSelectOne, selectedItems } = useBulkSelect(getSchemas.data);

  const handleBulkDelete = (): void => {
    selectedItems.forEach((item) => deleteSchema.mutate({ id: item }));
  };

  const goToCreateObject = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.TouchEvent<HTMLButtonElement>,
    id: string,
  ) => {
    e.stopPropagation();
    navigate(`/objects/new?schema=${id}`);
  };

  return (
    <Container layoutClassName={styles.container}>
      <OverviewPageHeaderTemplate
        title={t("Schemas")}
        button={
          <Button variant="primary" icon={faPlus} label={t("Add Schema")} onClick={() => navigate(`/schemas/new`)} />
        }
      />

      {getSchemas.isError && "Error..."}

      {getSchemas.isSuccess && (
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
                <TableHeader>{t("Objects")}</TableHeader>
                <TableHeader>{t("Date Created")}</TableHeader>
                <TableHeader>{t("Date Modified")}</TableHeader>
                <TableHeader />
              </TableRow>
            </TableHead>
            <TableBody>
              {getSchemas.data.map((schema) => (
                <TableRow key={schema.id}>
                  <TableCell>{<CheckboxBulkSelectOne id={schema.id} />}</TableCell>

                  <TableCell>{schema.name}</TableCell>

                  {getObjects.isSuccess && (
                    <TableCell>
                      {getObjects.data.results?.filter((object: any) => object._self.schema.id === schema.id).length}
                    </TableCell>
                  )}

                  {getObjects.isLoading && <TableCell>Loading...</TableCell>}
                  {getObjects.isError && <TableCell>Error</TableCell>}
                  <TableCell>{translateDate(i18n.language, schema.dateCreated)}</TableCell>

                  <TableCell>{translateDate(i18n.language, schema.dateModified)}</TableCell>

                  <TableCell className={styles.callsToAction}>
                    <Button
                      onClick={(e) => goToCreateObject(e, schema.id)}
                      variant="primary"
                      icon={faPlus}
                      label={t("Add Object")}
                    />

                    <Button
                      onClick={() => navigate(`/schemas/${schema.id}`)}
                      variant="primary"
                      icon={faGear}
                      label={t("Edit Schema")}
                    />
                  </TableCell>
                </TableRow>
              ))}
              {!getSchemas.data.length && (
                <TableRow>
                  <TableCell>{t("No schemas found")}</TableCell>
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

      {getSchemas.isLoading && <Skeleton height="200px" />}
    </Container>
  );
};

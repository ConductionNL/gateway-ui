import * as React from "react";
import * as styles from "./CollectionsTemplate.module.css";
import { Link } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@gemeente-denhaag/table";
import { useQueryClient } from "react-query";
import { navigate } from "gatsby";
import { Container } from "@conduction/components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faPlus } from "@fortawesome/free-solid-svg-icons";
import Skeleton from "react-loading-skeleton";
import { useCollection } from "../../hooks/collection";
import { Button } from "../../components/button/Button";
import { OverviewPageHeaderTemplate } from "../templateParts/overviewPageHeader/OverviewPageHeaderTemplate";
import { useBulkSelect } from "../../hooks/useBulkSelect";
import { BulkActionButton } from "../../components/bulkActionButton/BulkActionButton";
import { ActionButton } from "../../components/actionButton/ActionButton";

export const CollectionsTemplate: React.FC = () => {
  const { t } = useTranslation();

  const queryClient = useQueryClient();
  const _useCollection = useCollection(queryClient);
  const getCollection = _useCollection.getAll();
  const deleteCollection = _useCollection.remove();

  const { CheckboxBulkSelectAll, CheckboxBulkSelectOne, selectedItems, toggleItem } = useBulkSelect(getCollection.data);

  const handleBulkDelete = (): void => {
    selectedItems.forEach((item) => deleteCollection.mutate({ id: item }));
  };

  return (
    <Container layoutClassName={styles.container}>
      <OverviewPageHeaderTemplate
        title={t("Collections")}
        button={
          <Button
            variant="primary"
            label={t("Add Collection")}
            onClick={() => navigate(`/collections/new`)}
            icon={faPlus}
          />
        }
      />

      {getCollection.isError && "Error..."}

      {getCollection.isSuccess && (
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
                <TableHeader>{t("Actions")}</TableHeader>
                <TableHeader />
              </TableRow>
            </TableHead>
            <TableBody>
              {getCollection.data.map((collection: any) => (
                <TableRow key={collection.id} onClick={() => toggleItem(collection.id)}>
                  <TableCell>{<CheckboxBulkSelectOne id={collection.id} />}</TableCell>

                  <TableCell>{collection.name}</TableCell>

                  <TableCell>
                    <ActionButton
                      actions={[
                        { type: "delete", onSubmit: () => deleteCollection.mutate({ id: collection.id }) },
                        { type: "download", onSubmit: () => undefined, disabled: true },
                      ]}
                      variant="primary"
                    />
                  </TableCell>

                  <TableCell onClick={() => navigate(`/collections/${collection.id}`)}>
                    <Link icon={<FontAwesomeIcon icon={faArrowRight} />} iconAlign="start">
                      {t("Details")}
                    </Link>
                  </TableCell>
                </TableRow>
              ))}

              {!getCollection.data.length && (
                <TableRow>
                  <TableCell>{t("No collections found")}</TableCell>
                  <TableCell />
                  <TableCell />
                  <TableCell />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {getCollection.isLoading && <Skeleton height="200px" />}
    </Container>
  );
};

import * as React from "react";
import * as styles from "./ObjectTemplate.module.css";
import { Link } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { navigate } from "gatsby";
import { useObject } from "../../hooks/object";
import { useQueryClient } from "react-query";
import { Container } from "@conduction/components";
import Skeleton from "react-loading-skeleton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@gemeente-denhaag/table";
import { Paginate } from "../../components/paginate/Paginate";
import { Button } from "../../components/button/Button";
import { OverviewPageHeaderTemplate } from "../templateParts/overviewPageHeader/OverviewPageHeaderTemplate";
import { useBulkSelect } from "../../hooks/useBulkSelect";
import { BulkActionForm } from "../../components/bulkAction/BulkActionForm";

export const ObjectTemplate: React.FC = () => {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = React.useState<number>(1);

  const queryClient = useQueryClient();
  const _useObject = useObject(queryClient);
  const getObjects = _useObject.getAll(currentPage, 30);
  const deleteObject = _useObject.remove();

  const { CheckboxBulkSelectAll, CheckboxBulkSelectOne, selectedItems, reset } = useBulkSelect(currentPage);

  if (getObjects.isError) return <>Oops, something went wrong...</>;

  const handleDeleteObject = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.TouchEvent<HTMLButtonElement>,
    objectId: string,
  ) => {
    e.stopPropagation();

    const confirmDeletion = confirm("Are you sure you want to delete this object?");

    if (confirmDeletion) {
      deleteObject.mutate({ id: objectId });
    }
  };

  const handleBulkDelete = () => {
    selectedItems.forEach((item) => deleteObject.mutate({ id: item }));
    reset();
  };

  return (
    <Container layoutClassName={styles.container}>
      <OverviewPageHeaderTemplate
        title={t("Objects")}
        button={
          <Button variant="primary" icon={faPlus} label={t("Add Object")} onClick={() => navigate("/objects/new")} />
        }
      />

      {getObjects.isSuccess && (
        <div>
          <BulkActionForm
            actions={[{ label: "Delete", onSubmit: handleBulkDelete }]}
            selectedItemsCount={selectedItems.length}
          />

          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>
                  <CheckboxBulkSelectAll />
                </TableHeader>
                <TableHeader>{t("Id")}</TableHeader>
                <TableHeader>{t("Name")}</TableHeader>
                <TableHeader>{t("Schema")}</TableHeader>
                <TableHeader>{t("Sources")}</TableHeader>
                <TableHeader></TableHeader>
                <TableHeader></TableHeader>
              </TableRow>
            </TableHead>

            <TableBody>
              {!!getObjects.data.results.length &&
                getObjects.data.results.map((object: any) => (
                  <TableRow key={object.id}>
                    <TableCell>{<CheckboxBulkSelectOne id={object.id} />}</TableCell>
                    <TableCell>{object._self?.id ?? "-"}</TableCell>
                    <TableCell>{object._self?.name ?? "NVT"}</TableCell>
                    <TableCell>{object._self?.schema?.id ?? "-"}</TableCell>
                    <TableCell>{object._self?.sources ?? "-"}</TableCell>
                    <TableCell>
                      <Button
                        variant="danger"
                        label={t("Delete")}
                        icon={faTrash}
                        onClick={(e) => handleDeleteObject(e, object.id)}
                      />
                    </TableCell>
                    <TableCell onClick={() => navigate(`/objects/${object.id}`)}>
                      <Link icon={<FontAwesomeIcon icon={faArrowRight} />} iconAlign="start">
                        {t("Details")}
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}

              {!getObjects.data.results.length && (
                <TableRow>
                  <TableCell>{t("No objects found")}</TableCell>
                  <TableCell />
                  <TableCell />
                  <TableCell />
                  <TableCell />
                  <TableCell />
                </TableRow>
              )}
            </TableBody>
          </Table>
          <Paginate totalPages={getObjects.data.pages} currentPage={currentPage} changePage={setCurrentPage} />
        </div>
      )}
      {getObjects.isLoading && <Skeleton height="200px" />}
    </Container>
  );
};

import * as React from "react";
import * as styles from "./ObjectsTable.module.css";
import { navigate } from "gatsby";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@gemeente-denhaag/table";
import { Link } from "@gemeente-denhaag/components-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { useObject } from "../../../hooks/object";
import { useQueryClient } from "react-query";
import { Paginate } from "../../../components/paginate/Paginate";
import { useTranslation } from "react-i18next";
import { useBulkSelect } from "../../../hooks/useBulkSelect";
import { BulkActionButton } from "../../../components/bulkActionButton/BulkActionButton";

interface ObjectsTableProps {
  objects: any[];
  pagination: {
    totalPages: number;
    currentPage: number;
    changePage: React.Dispatch<React.SetStateAction<number>>;
  };
}

export const ObjectsTable: React.FC<ObjectsTableProps> = ({ objects, pagination }) => {
  const { t } = useTranslation();

  const queryClient = useQueryClient();
  const deleteObject = useObject(queryClient).remove();

  const { CheckboxBulkSelectAll, CheckboxBulkSelectOne, selectedItems } = useBulkSelect(objects);

  const handleBulkDelete = () => {
    selectedItems.forEach((item) => deleteObject.mutate({ id: item }));
  };

  return (
    <div className={styles.container}>
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
            <TableHeader>{t("Id")}</TableHeader>
            <TableHeader>{t("Name")}</TableHeader>
            <TableHeader>{t("Schema")}</TableHeader>
            <TableHeader></TableHeader>
          </TableRow>
        </TableHead>

        <TableBody>
          {!!objects.length &&
            objects.map((object) => (
              <TableRow key={object._self.id}>
                <TableCell>{<CheckboxBulkSelectOne id={object.id} />}</TableCell>
                <TableCell>{object._self.id ?? "-"}</TableCell>
                <TableCell>{object._self.name ?? "NVT"}</TableCell>
                <TableCell>{object._self?.schema?.id ?? "-"}</TableCell>
                <TableCell onClick={() => navigate(`/objects/${object._self.id}`)}>
                  <Link icon={<FontAwesomeIcon icon={faArrowRight} />} iconAlign="start">
                    {t("Details")}
                  </Link>
                </TableCell>
              </TableRow>
            ))}

          {!objects.length && (
            <TableRow>
              <TableCell>{t("No objects found")}</TableCell>
              <TableCell />
              <TableCell />
              <TableCell />
              <TableCell />
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Paginate {...pagination} />
    </div>
  );
};

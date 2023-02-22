import * as React from "react";
import { navigate } from "gatsby";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@gemeente-denhaag/table";
import { Link } from "@gemeente-denhaag/components-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useObject } from "../../../hooks/object";
import { useQueryClient } from "react-query";
import { Button } from "../../../components/button/Button";
import { Paginate } from "../../../components/paginate/Paginate";
import { useTranslation } from "react-i18next";

interface ObjectsTableProps {
  objects: any[];
  pagination: {
    totalPages: number;
    currentPage: number;
    changePage: React.Dispatch<React.SetStateAction<number>>;
  };
  schemaId?: string;
}

export const ObjectsTable: React.FC<ObjectsTableProps> = ({ objects, pagination, schemaId }) => {
  const { t } = useTranslation();

  const queryClient = useQueryClient();

  const _useObject = useObject(queryClient);
  const deleteSchema = _useObject.remove();

  const handleDeleteObject = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.TouchEvent<HTMLButtonElement>,
    objectId: string,
  ) => {
    e.stopPropagation();

    const confirmDeletion = confirm("Are you sure you want to delete this object?");

    if (confirmDeletion) {
      deleteSchema.mutate({ id: objectId });
    }
  };

  return (
    <>
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>{t("Id")}</TableHeader>
            <TableHeader>{t("Name")}</TableHeader>
            <TableHeader>{t("Sources")}</TableHeader>
            <TableHeader></TableHeader>
            <TableHeader></TableHeader>
          </TableRow>
        </TableHead>

        <TableBody>
          {!!objects.length &&
            objects.map((object) => (
              <TableRow
                onClick={() => navigate(`/objects/${object._self.id}?schema=${schemaId}`)}
                key={object._self.id}
              >
                <TableCell>{object._self.id ?? "-"}</TableCell>
                <TableCell>{object._self.name ?? "NVT"}</TableCell>
                <TableCell>{object._self.sources ?? "-"}</TableCell>
                <TableCell>
                  <Button
                    variant="danger"
                    icon={faTrash}
                    label={t("Delete")}
                    onClick={(e) => handleDeleteObject(e, object._self.id)}
                  />
                </TableCell>
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
    </>
  );
};

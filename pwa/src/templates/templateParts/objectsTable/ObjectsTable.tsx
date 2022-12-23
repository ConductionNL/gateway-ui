import * as React from "react";
import * as styles from "./ObjectsTable.module.css";
import { t } from "i18next";
import { navigate } from "gatsby";
import { ArrowRightIcon } from "@gemeente-denhaag/icons";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@gemeente-denhaag/table";
import { Button, Link } from "@gemeente-denhaag/components-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import clsx from "clsx";
import { useObject } from "../../../hooks/object";
import { useQueryClient } from "react-query";

interface ObjectsTableProps {
  objects: any[];
}

export const ObjectsTable: React.FC<ObjectsTableProps> = ({ objects }) => {
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
    <Table>
      <TableHead>
        <TableRow>
          <TableHeader>{t("Id")}</TableHeader>
          <TableHeader>{t("Name")}</TableHeader>
          <TableHeader>{t("Type")}</TableHeader>
          <TableHeader>{t("Sources")}</TableHeader>
          <TableHeader></TableHeader>
          <TableHeader></TableHeader>
        </TableRow>
      </TableHead>

      <TableBody>
        {objects.map((object) => (
          <TableRow onClick={() => navigate(`/objects/${object._self.id}`)} key={object._self.id}>
            <TableCell>{object._self.id ?? "-"}</TableCell>
            <TableCell>{object._self.name ?? "NVT"}</TableCell>
            <TableCell>{object._self.type?.name ?? "-"}</TableCell>
            <TableCell>{object._self.sources ?? "-"}</TableCell>
            <TableCell>
              <Button
                onClick={(e) => handleDeleteObject(e, object._self.id)}
                className={clsx(styles.buttonIcon, styles.deleteButton)}
              >
                <FontAwesomeIcon icon={faTrash} />
                {t("Delete")}
              </Button>
            </TableCell>
            <TableCell onClick={() => navigate(`/objects/${object._self.id}`)}>
              <Link icon={<ArrowRightIcon />} iconAlign="start">
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
            <TableCell />
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

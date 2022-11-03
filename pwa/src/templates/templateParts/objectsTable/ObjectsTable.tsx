import * as React from "react";
import { t } from "i18next";
import { navigate } from "gatsby";
import { ArrowRightIcon } from "@gemeente-denhaag/icons";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@gemeente-denhaag/table";
import { Link } from "@gemeente-denhaag/components-react";

interface ObjectsTableProps {
  objects: any[];
}

export const ObjectsTable: React.FC<ObjectsTableProps> = ({ objects }) => {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeader>{t("Id")}</TableHeader>
          <TableHeader>{t("Name")}</TableHeader>
          <TableHeader>{t("Type")}</TableHeader>
          <TableHeader>{t("Sources")}</TableHeader>
          <TableHeader></TableHeader>
        </TableRow>
      </TableHead>

      <TableBody>
        {objects.map((object) => (
          <TableRow onClick={() => navigate(`/objects/${object.id}`)} key={object.id}>
            <TableCell>{object.id ?? "-"}</TableCell>
            <TableCell>{object.name ?? "NVT"}</TableCell>
            <TableCell>{object.type?.name ?? "-"}</TableCell>
            <TableCell>{object.sources ?? "-"}</TableCell>
            <TableCell onClick={() => navigate(`/objects/${object.id}`)}>
              <Link icon={<ArrowRightIcon />} iconAlign="start">
                {t("Details")}
              </Link>
            </TableCell>
          </TableRow>
        ))}

        {!objects.length && (
          <>
            <TableRow>
              <TableCell>Geen objecten gevonden</TableCell>
              <TableCell />
              <TableCell />
              <TableCell />
            </TableRow>
          </>
        )}
      </TableBody>
    </Table>
  );
};

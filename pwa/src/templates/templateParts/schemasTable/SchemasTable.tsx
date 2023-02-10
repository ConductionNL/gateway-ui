import * as React from "react";
import { t } from "i18next";
import { navigate } from "gatsby";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@gemeente-denhaag/table";
import { Link } from "@gemeente-denhaag/components-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

interface SchemasTableProps {
  schemas: any[];
}

export const SchemasTable: React.FC<SchemasTableProps> = ({ schemas }) => {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeader>{t("Name")}</TableHeader>
          <TableHeader></TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        {schemas.map((schema) => (
          <TableRow onClick={() => navigate(`/schemas/${schema.id}`)} key={schema.id}>
            <TableCell>{schema.name}</TableCell>

            <TableCell onClick={() => navigate(`/schemas/${schema.id}`)}>
              <Link icon={<FontAwesomeIcon icon={faArrowRight} />} iconAlign="start">
                {t("Details")}
              </Link>
            </TableCell>
          </TableRow>
        ))}
        {!schemas.length && (
          <TableRow>
            <TableCell>{t("No schemas found")}</TableCell>
            <TableCell />
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

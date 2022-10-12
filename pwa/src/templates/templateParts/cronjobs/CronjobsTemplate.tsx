import * as React from "react";
import { Heading1 } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@gemeente-denhaag/table";

export const CronjobsTemplate: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <Heading1>{t("Cronjobs")}</Heading1>
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>{t("Name")}</TableHeader>
            <TableHeader>{t("Active")}</TableHeader>
            <TableHeader>Cron tab</TableHeader>
            <TableHeader>{t("Last run")}</TableHeader>
            <TableHeader>{t("Next run")}</TableHeader>
            <TableHeader>Status</TableHeader>
            <TableHeader>{t("Date created")}</TableHeader>
            <TableHeader>{t("Date modified")}</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell>#</TableCell>
            <TableCell>#</TableCell>
            <TableCell>#</TableCell>
            <TableCell>#</TableCell>
            <TableCell>#</TableCell>
            <TableCell>#</TableCell>
            <TableCell>#</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </>
  );
};

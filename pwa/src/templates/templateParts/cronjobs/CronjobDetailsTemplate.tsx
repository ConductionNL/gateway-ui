import * as React from "react";
import { Heading1 } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { QueryClient } from "react-query";
import { useCronjob } from "../../../hooks/cronjob";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@gemeente-denhaag/table";

interface CronjobDetailPageProps {
  cronjobId: string;
}

export const CronjobsDetailTemplate: React.FC<CronjobDetailPageProps> = ({ cronjobId }) => {
  const { t } = useTranslation();

  const queryClient = new QueryClient();
  const _useCronjob = useCronjob(queryClient);
  const getCronjob = _useCronjob.getOne(cronjobId);

  return (
    <>
      <Heading1>{t("Cronjob detail page")}</Heading1>

      {getCronjob.isLoading && "Loading..."}
      {getCronjob.isError && "Error..."}

      {getCronjob.isSuccess && (
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>{t("Name")}</TableHeader>
              <TableHeader>{t("Description")}</TableHeader>
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
              <TableCell>{getCronjob.data.name}</TableCell>
              <TableCell>{getCronjob.data.description}</TableCell>
              <TableCell>-</TableCell>
              <TableCell>{getCronjob.data.crontab}</TableCell>
              <TableCell>{getCronjob.data.lastRun}</TableCell>
              <TableCell>{getCronjob.data.nextRun}</TableCell>
              <TableCell>-</TableCell>
              <TableCell>-</TableCell>
              <TableCell>-</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )}
    </>
  );
};

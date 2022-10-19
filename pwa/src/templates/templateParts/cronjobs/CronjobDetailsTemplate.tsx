import * as React from "react";
import * as styles from "./CronjobDetailsTemplate.module.css";
import { Heading1, Link } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { QueryClient } from "react-query";
import { useCronjob } from "../../../hooks/cronjob";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@gemeente-denhaag/table";
import { ArrowLeftIcon } from "@gemeente-denhaag/icons";
import { navigate } from "gatsby";
import { Container } from "@conduction/components";

interface CronjobDetailPageProps {
  cronjobId: string;
}

export const CronjobsDetailTemplate: React.FC<CronjobDetailPageProps> = ({ cronjobId }) => {
  const { t } = useTranslation();

  const queryClient = new QueryClient();
  const _useCronjob = useCronjob(queryClient);
  const getCronjob = _useCronjob.getOne(cronjobId);

  return (
    <Container layoutClassName={styles.container}>
      <div onClick={() => navigate("/cronjobs")}>
        <Link icon={<ArrowLeftIcon />} iconAlign="start">
          {t("Back to cronjobs")}
        </Link>
      </div>

      <Heading1>{t("Cronjob detail page")}</Heading1>

      {getCronjob.isLoading && "Loading..."}
      {getCronjob.isError && "Error..."}

      {getCronjob.isSuccess && (
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>{t("Name")}</TableHeader>
              <TableHeader>{t("Description")}</TableHeader>
              <TableHeader>{t("Cronab")}</TableHeader>
              <TableHeader>{t("Action 0/1")}</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>{getCronjob.data.name}</TableCell>
              <TableCell>{getCronjob.data.description}</TableCell>
              <TableCell>-</TableCell>
              <TableCell>-</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )}
    </Container>
  );
};

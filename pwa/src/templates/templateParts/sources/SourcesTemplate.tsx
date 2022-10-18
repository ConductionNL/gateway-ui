import * as React from "react";
import * as styles from "./SourcesTemplate.module.css";
import { Heading1 } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from "@gemeente-denhaag/table";
import { navigate } from "gatsby";
import { useSources } from "../../../hooks/sources";
import { QueryClient } from "react-query";

export const SourcesTemplate: React.FC = () => {
  const { t } = useTranslation();

  const queryClient = new QueryClient();
  const _useSources = useSources(queryClient);
  const getSources = _useSources.getAll();

  return (
    <div className={styles.container}>
      <Heading1>{t("Sources")}</Heading1>

      {getSources.isLoading && "Loading..."}
      {getSources.isError && "Error..."}

      {getSources.isSuccess && (
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>Name</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader>Last sync</TableHeader>
              <TableHeader>Related Sync objects</TableHeader>
              <TableHeader>DateCreated</TableHeader>
              <TableHeader>DateModified</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {getSources.data.map((source) => (
              <TableRow onClick={() => navigate(`/sources/${source.id}`)} key={source.id}>
                <TableCell>{source.name}</TableCell>
                <TableCell>{source.status ?? "-"}</TableCell>
                <TableCell>{source.sync ?? "-"}</TableCell>
                <TableCell>{source.lastRun ?? "-"}</TableCell>
                <TableCell>{source.dateCreated}</TableCell>
                <TableCell>{source.dateModified}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

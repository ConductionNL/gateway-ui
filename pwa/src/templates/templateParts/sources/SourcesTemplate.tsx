import * as React from "react";
import * as styles from "./SourcesTemplate.module.css";
import { Heading1, Link } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from "@gemeente-denhaag/table";
import { navigate } from "gatsby";
import { useSources } from "../../../hooks/sources";
import { QueryClient } from "react-query";
import { Tag } from "@conduction/components";
import _ from "lodash";
import clsx from "clsx";
import { ArrowRightIcon } from "@gemeente-denhaag/icons";

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
              <TableHeader>{t("Name")}</TableHeader>
              <TableHeader>{t("Status")}</TableHeader>
              <TableHeader>{t("Last sync")}</TableHeader>
              <TableHeader>{t("Related Sync objects")}</TableHeader>
              <TableHeader>{t("Created")}</TableHeader>
              <TableHeader>{t("Modified")}</TableHeader>
              <TableHeader />
            </TableRow>
          </TableHead>
          <TableBody>
            {getSources.data.map((source) => (
              <TableRow className={styles.tableRow} onClick={() => navigate(`/sources/${source.id}`)} key={source.id}>
                <TableCell>{source.name}</TableCell>
                <TableCell>
                  <div className={clsx(styles[source.status === "Ok" ? "statusOk" : "statusFailed"])}>
                    <Tag label={source.status ?? "-"} />
                  </div>
                </TableCell>
                <TableCell>{source.sync ?? "-"}</TableCell>
                <TableCell>{source.lastRun ?? "-"}</TableCell>
                <TableCell>{source.dateCreated}</TableCell>
                <TableCell>{source.dateModified}</TableCell>
                <TableCell onClick={() => navigate(`/sources/${source.id}`)}>
                  <Link className={styles.detailsLink} icon={<ArrowRightIcon />} iconAlign="start">
                    {t("Details")}
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

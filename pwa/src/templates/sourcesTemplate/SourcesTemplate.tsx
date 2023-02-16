import * as React from "react";
import * as styles from "./SourcesTemplate.module.css";
import { Link } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from "@gemeente-denhaag/table";
import { navigate } from "gatsby";
import { useSource } from "../../hooks/source";
import { useQueryClient } from "react-query";
import { Tag, ToolTip } from "@conduction/components";
import _ from "lodash";
import clsx from "clsx";
import { translateDate } from "../../services/dateFormat";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faPlus } from "@fortawesome/free-solid-svg-icons";
import Skeleton from "react-loading-skeleton";
import { getStatusColor, getStatusIcon } from "../../services/getStatusColorAndIcon";
import TableWrapper from "../../components/tableWrapper/TableWrapper";
import { dateTime } from "../../services/dateTime";
import { Button } from "../../components/button/Button";
import { OverviewPageHeaderTemplate } from "../templateParts/overviewPageHeader/OverviewPageHeaderTemplate";

export const SourcesTemplate: React.FC = () => {
  const { t, i18n } = useTranslation();

  const queryClient = useQueryClient();
  const _useSources = useSource(queryClient);
  const getSources = _useSources.getAll();

  return (
    <div className={styles.container}>
      <OverviewPageHeaderTemplate
        title={t("Sources")}
        button={
          <Button variant="primary" icon={faPlus} label={t("Add Source")} onClick={() => navigate(`/sources/new`)} />
        }
      />

      {getSources.isError && "Error..."}

      {getSources.isSuccess && (
        <TableWrapper>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>{t("Name")}</TableHeader>
                <TableHeader>{t("Status")}</TableHeader>
                <TableHeader>{t("Related Sync objects")}</TableHeader>
                <TableHeader>{t("Last call")}</TableHeader>
                <TableHeader>{t("Created")}</TableHeader>
                <TableHeader>{t("Modified")}</TableHeader>
                <TableHeader />
              </TableRow>
            </TableHead>
            <TableBody>
              {getSources.data.map((source) => (
                <TableRow className={styles.tableRow} onClick={() => navigate(`/sources/${source.id}`)} key={source.id}>
                  <TableCell>{source.name}</TableCell>
                  <TableCell className={styles.tableCellFullWidth}>
                    <div className={clsx(styles[getStatusColor(source.status ?? "no known status")])}>
                      <ToolTip tooltip="Status">
                        <Tag
                          icon={<FontAwesomeIcon icon={getStatusIcon(source.status ?? "no known status")} />}
                          label={source.status?.toString() ?? "no known status"}
                        />
                      </ToolTip>
                    </div>
                  </TableCell>
                  <TableCell>{source.sync ?? "-"}</TableCell>
                  <TableCell className={styles.tableCellFullWidth}>
                    {dateTime(t(i18n.language), source.lastCall) ?? "-"}
                  </TableCell>
                  <TableCell>{translateDate(i18n.language, source.dateCreated)}</TableCell>
                  <TableCell>{translateDate(i18n.language, source.dateModified)}</TableCell>
                  <TableCell onClick={() => navigate(`/sources/${source.id}`)}>
                    <Link icon={<FontAwesomeIcon icon={faArrowRight} />} iconAlign="start">
                      {t("Details")}
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
              {!getSources.data.length && (
                <TableRow>
                  <TableCell>{t("No sources found")}</TableCell>
                  <TableCell />
                  <TableCell />
                  <TableCell />
                  <TableCell />
                  <TableCell />
                  <TableCell />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableWrapper>
      )}

      {getSources.isLoading && <Skeleton height="200px" />}
    </div>
  );
};

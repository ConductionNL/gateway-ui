import * as React from "react";
import * as styles from "./SourcesTemplate.module.css";
import { Button, Heading1, Link } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from "@gemeente-denhaag/table";
import { navigate } from "gatsby";
import { useSource } from "../../hooks/source";
import { QueryClient } from "react-query";
import { Tag, ToolTip } from "@conduction/components";
import _ from "lodash";
import clsx from "clsx";
import { ArrowRightIcon } from "@gemeente-denhaag/icons";
import { translateDate } from "../../services/dateFormat";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Skeleton from "react-loading-skeleton";
import { getStatusColor, getStatusIcon } from "../../services/getStatusColorAndIcon";
import TableWrapper from "../../components/tableWrapper/TableWrapper";
import { dateTime } from "../../services/dateTime";

export const SourcesTemplate: React.FC = () => {
  const { t, i18n } = useTranslation();

  const queryClient = new QueryClient();
  const _useSources = useSource(queryClient);
  const getSources = _useSources.getAll();

  return (
    <div className={styles.container}>
      <section className={styles.section}>
        <Heading1>{t("Sources")}</Heading1>
        <div className={styles.buttons}>
          <Button className={styles.buttonIcon} onClick={() => navigate(`/sources/new`)}>
            <FontAwesomeIcon icon={faPlus} />
            {t("Add")}
          </Button>
        </div>
      </section>

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
                    {(source.lastCall && dateTime(source.lastCall)) ?? "-"}
                  </TableCell>
                  <TableCell>{translateDate(i18n.language, source.dateCreated)}</TableCell>
                  <TableCell>{translateDate(i18n.language, source.dateModified)}</TableCell>
                  <TableCell onClick={() => navigate(`/sources/${source.id}`)}>
                    <Link icon={<ArrowRightIcon />} iconAlign="start">
                      {t("Details")}
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableWrapper>
      )}

      {getSources.isLoading && <Skeleton height="200px" />}
    </div>
  );
};

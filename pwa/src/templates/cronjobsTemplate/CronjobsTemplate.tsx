import * as React from "react";
import * as styles from "./CronjobsTemplate.module.css";
import { Button, Heading1, Link } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@gemeente-denhaag/table";
import { QueryClient } from "react-query";
import { useCronjob } from "../../hooks/cronjob";
import { navigate } from "gatsby";
import { Container, Tag } from "@conduction/components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Skeleton from "react-loading-skeleton";
import { ArrowRightIcon } from "@gemeente-denhaag/icons";
import clsx from "clsx";
import { translateDate } from "../../services/dateFormat";
import { dateTime } from "../../services/dateTime";
import { GatsbyContext } from "../../context/gatsby";
import { PaginatedItems } from "../../components/pagination/pagination";
import TableWrapper from "../../components/tableWrapper/TableWrapper";

export const CronjobsTemplate: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { screenSize } = React.useContext(GatsbyContext);
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const [marginPagesDisplayed, setMarginPageDisplayed] = React.useState<number>(3);

  const queryClient = new QueryClient();
  const _useCronjob = useCronjob(queryClient);
  const getCronjobs = _useCronjob.getAll(currentPage);

  // React.useEffect(() => {
  //   if (getCronjobs.isSuccess && screenSize === "mobile") {
  //     setMarginPageDisplayed(2);
  //   }
  //   if (getCronjobs.isSuccess && screenSize === "mobile" && getCronjobs.data.pages > 100) {
  //     setMarginPageDisplayed(1);
  //   }
  //   if (getCronjobs.isSuccess && screenSize !== "mobile") {
  //     setMarginPageDisplayed(3);
  //   }
  // }, [getCronjobs]);

  return (
    <Container layoutClassName={styles.container}>
      <section className={styles.section}>
        <Heading1>{t("Cronjobs")}</Heading1>
        <div className={styles.buttons}>
          <Button className={styles.buttonIcon} onClick={() => navigate(`/cronjobs/new`)}>
            <FontAwesomeIcon icon={faPlus} />
            {t("Add Cronjob")}
          </Button>
        </div>
      </section>

      {getCronjobs.isError && "Error..."}

      {getCronjobs.isSuccess && (
        <>
          <TableWrapper>
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeader>{t("Name")}</TableHeader>
                  <TableHeader>{t("Status")}</TableHeader>
                  <TableHeader>{t("Active")}</TableHeader>
                  <TableHeader>CronTab</TableHeader>
                  <TableHeader>{t("Last run")}</TableHeader>
                  <TableHeader>{t("Next run")}</TableHeader>
                  <TableHeader>Status</TableHeader>
                  <TableHeader>{t("Date created")}</TableHeader>
                  <TableHeader>{t("Date modified")}</TableHeader>
                  <TableHeader></TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {getCronjobs.data.map((cronjob) => (
                  <TableRow
                    className={styles.tableRow}
                    onClick={() => navigate(`/cronjobs/${cronjob.id}`)}
                    key={cronjob.id}
                  >
                    <TableCell>{cronjob.name}</TableCell>
                    <TableCell>
                      <div className={clsx(styles[cronjob.status === "Ok" ? "statusOk" : "statusFailed"])}>
                        <Tag label={cronjob.status?.toString() ?? "-"} />
                      </div>
                    </TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>{cronjob.crontab}</TableCell>
                    <TableCell>{dateTime(t(i18n.language), cronjob.lastRun) ?? "-"}</TableCell>
                    <TableCell>{dateTime(t(i18n.language), cronjob.nextRun) ?? "-"}</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>{translateDate(i18n.language, cronjob.dateCreated)}</TableCell>
                    <TableCell>{translateDate(i18n.language, cronjob.dateMo)}</TableCell>
                    <TableCell onClick={() => navigate(`/cronjobs/${cronjob.id}`)}>
                      <Link icon={<ArrowRightIcon />} iconAlign="start">
                        {t("Details")}
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableWrapper>

          {!!getCronjobs.data.length && (
            <PaginatedItems
              pages={2}
              currentPage={currentPage}
              setPage={setCurrentPage}
              pageRangeDisplayed={2}
              marginPagesDisplayed={marginPagesDisplayed}
            />
          )}
        </>
      )}

      {getCronjobs.isLoading && <Skeleton height="200px" />}
    </Container>
  );
};

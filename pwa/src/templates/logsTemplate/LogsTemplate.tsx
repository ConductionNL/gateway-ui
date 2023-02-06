import * as React from "react";
import * as styles from "./LogsTemplate.module.css";

import _ from "lodash";
import { useLog } from "../../hooks/log";
import { QueryClient } from "react-query";
import Skeleton from "react-loading-skeleton";
import { useTranslation } from "react-i18next";
import { Container } from "@conduction/components";
import { Heading1 } from "@gemeente-denhaag/components-react";
import { LogFiltersTemplate } from "../templateParts/logFilters/LogFiltersTemplate";
import { LogFiltersContext } from "../../context/logs";
import { PaginatedItems } from "../../components/pagination/pagination";
import { PaginationFiltersContext } from "../../context/filters";
import { GatsbyContext } from "../../context/gatsby";
import { LogsTableTemplate } from "../templateParts/logsTable/LogsTableTemplate";

export const LogsTemplate: React.FC = () => {
  const { t } = useTranslation();
  const [logFilters] = React.useContext(LogFiltersContext);
  const { screenSize } = React.useContext(GatsbyContext);
  const [marginPagesDisplayed, setMarginPageDisplayed] = React.useState<number>(3);

  const [pagination, setPagination] = React.useContext(PaginationFiltersContext);

  const queryClient = new QueryClient();
  const getLogs = useLog(queryClient).getAll(logFilters, pagination);

  React.useEffect(() => {
    if (getLogs.isSuccess && screenSize === "mobile") {
      setMarginPageDisplayed(2);
    }
    if (getLogs.isSuccess && screenSize === "mobile" && getLogs.data.pages > 100) {
      setMarginPageDisplayed(1);
    }
    if (getLogs.isSuccess && screenSize !== "mobile") {
      setMarginPageDisplayed(3);
    }
  }, [getLogs]);

  return (
    <Container layoutClassName={styles.container}>
      <Heading1>{t("Logs")}</Heading1>

      <LogFiltersTemplate />

      {getLogs.isSuccess && (
        <>
          <LogsTableTemplate logs={getLogs.data.results} />

          <PaginatedItems
            pages={getLogs.data.pages}
            currentPage={getLogs.data.page}
            setPage={(page) => setPagination({ ...pagination, logCurrentPage: page })}
            pageRangeDisplayed={2}
            marginPagesDisplayed={marginPagesDisplayed}
            containerClassName={styles.paginationContainer}
            pageClassName={getLogs.data.pages > 1000 ? styles.paginationLinkSmall : styles.paginationLink}
            previousClassName={getLogs.data.pages > 1000 ? styles.paginationLinkSmall : styles.paginationLink}
            nextClassName={getLogs.data.pages > 1000 ? styles.paginationLinkSmall : styles.paginationLink}
            activeClassName={getLogs.data.pages > 1000 ? styles.paginationActivePageSmall : styles.paginationActivePage}
            disabledClassName={styles.paginationDisabled}
            breakClassName={styles.breakLink}
          />
        </>
      )}

      {getLogs.isError && "Error..."}
      {getLogs.isLoading && <Skeleton height="200px" />}
    </Container>
  );
};

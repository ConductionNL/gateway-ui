import * as React from "react";
import * as styles from "./LogsTemplate.module.css";

import _ from "lodash";
import { useLog } from "../../hooks/log";
import { useQueryClient } from "react-query";
import Skeleton from "react-loading-skeleton";
import { useTranslation } from "react-i18next";
import { Container } from "@conduction/components";
import { Heading1 } from "@gemeente-denhaag/components-react";
import { LogFiltersTemplate } from "../templateParts/logFilters/LogFiltersTemplate";
import { useLogFiltersContext } from "../../context/logs";
import { LogsTableTemplate } from "../templateParts/logsTable/LogsTableTemplate";

export const LogsTemplate: React.FC = () => {
  const { t } = useTranslation();
  const { logFilters } = useLogFiltersContext();
  const [currentPage, setCurrentPage] = React.useState<number>(1);

  const queryClient = useQueryClient();
  const getLogs = useLog(queryClient).getAll(logFilters, currentPage);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [logFilters]);

  return (
    <Container layoutClassName={styles.container}>
      <Heading1>{t("Logs")}</Heading1>

      <LogFiltersTemplate />

      {getLogs.isSuccess && (
        <LogsTableTemplate
          logs={getLogs.data.results}
          pagination={{
            totalPages: getLogs.data.pages,
            currentPage: currentPage,
            changePage: setCurrentPage,
          }}
        />
      )}

      {getLogs.isError && "Error..."}
      {getLogs.isLoading && <Skeleton height="200px" />}
    </Container>
  );
};

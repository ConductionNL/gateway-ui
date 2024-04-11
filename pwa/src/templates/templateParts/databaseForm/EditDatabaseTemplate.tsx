import * as React from "react";
import * as styles from "./EditDatabaseTemplate.module.css";
import { useQueryClient } from "react-query";
import Skeleton from "react-loading-skeleton";
import { useDatabase } from "../../../hooks/database";
import { DatabaseFormTemplate, formId } from "./DatabaseFormTemplate";
import { useDashboardCard } from "../../../hooks/useDashboardCard";
import { useTranslation } from "react-i18next";
import { Link, Tab, TabContext, TabPanel, Tabs } from "@gemeente-denhaag/components-react";
import { useCurrentTabContext } from "../../../context/tabs";
import { Container } from "@conduction/components";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@gemeente-denhaag/table";
import { navigate } from "gatsby";
import { useIsLoadingContext } from "../../../context/isLoading";
import { useLog } from "../../../hooks/log";
import { LogsTableTemplate } from "../logsTable/LogsTableTemplate";
import { FormHeaderTemplate } from "../formHeader/FormHeaderTemplate";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CHANNEL_LOG_LIMIT } from "../../../apiService/resources/log";

interface EditDatabaseTemplateProps {
  databaseId: string;
}

export const EditDatabaseTemplate: React.FC<EditDatabaseTemplateProps> = ({ databaseId }) => {
  const { t } = useTranslation();
  const { setIsLoading, isLoading } = useIsLoadingContext();
  const { currentTabs, setCurrentTabs } = useCurrentTabContext();
  const queryClient = useQueryClient();
  const _useDatabases = useDatabase(queryClient);
  const getDatabase = _useDatabases.getOne(databaseId);
  const deleteDatabase = _useDatabases.remove();

  const handleDeleteDatabase = () => {
    const confirmDeletion = confirm("Are you sure you want to delete this database?");

    confirmDeletion && deleteDatabase.mutate({ id: databaseId });
  };
  
  return (
    <Container layoutClassName={styles.container}>
      <FormHeaderTemplate
        title={getDatabase.data?.id ? `Edit ${getDatabase.data.name}` : "Edit Database"}
        {...{ formId }}
        disabled={isLoading.databaseForm}
        handleDelete={handleDeleteDatabase}
      />

      {getDatabase.isSuccess && <DatabaseFormTemplate database={getDatabase.data} />}

      {getDatabase.isSuccess && (
        <div>
          <TabContext value={currentTabs.databaseDetailTabs.toString()}>
            <Tabs
              value={currentTabs.databaseDetailTabs}
              onChange={(_, newValue: number) => {
                setCurrentTabs({ ...currentTabs, databaseDetailTabs: newValue });
              }}
              variant="scrollable"
            >
            </Tabs>
          </TabContext>
        </div>
      )}

      {getDatabase.isLoading && <Skeleton height={200} />}
    </Container>
  );
};

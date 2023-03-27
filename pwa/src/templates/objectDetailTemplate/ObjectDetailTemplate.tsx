import * as React from "react";
import * as styles from "./ObjectDetailTemplate.module.css";
import { Link, Tab, TabContext, TabPanel, Tabs } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "react-query";
import { useObject } from "../../hooks/object";
import { Container } from "@conduction/components";
import Skeleton from "react-loading-skeleton";
import { EditObjectFormTemplate } from "../templateParts/objectsFormTemplate/EditObjectFormTemplate";
import clsx from "clsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { navigate } from "gatsby";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@gemeente-denhaag/table";
import { useSync } from "../../hooks/synchronization";
import { useCurrentTabContext } from "../../context/tabs";
import { useLog } from "../../hooks/log";
import { LogsTableTemplate } from "../templateParts/logsTable/LogsTableTemplate";
import { Button } from "../../components/button/Button";

interface ObjectDetailTemplateProps {
  objectId: string;
}

export const ObjectDetailTemplate: React.FC<ObjectDetailTemplateProps> = ({ objectId }) => {
  const { t } = useTranslation();
  const { currentTabs, setCurrentTabs } = useCurrentTabContext();
  const [currentLogsPage, setCurrentLogsPage] = React.useState<number>(1);

  const queryClient = useQueryClient();
  const _useObject = useObject(queryClient);
  const getObject = _useObject.getOne(objectId);

  const _useSync = useSync(queryClient);
  const getSynchronizations = _useSync.getAll();
  const deleteSync = _useSync.remove();

  const getSchema = _useObject.getSchema(objectId);

  const getLogs = useLog().getAllFromChannel("object", objectId, currentLogsPage);

  const handleDeleteObject = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.TouchEvent<HTMLButtonElement>,
    syncId: string,
  ) => {
    e.stopPropagation();

    const confirmDeletion = confirm("Are you sure you want to delete this object?");

    if (confirmDeletion) {
      deleteSync.mutate({ id: syncId });
    }
  };

  return (
    <Container layoutClassName={styles.container}>
      {getObject.isError && "Error..."}

      {getObject.isSuccess && getSchema.isSuccess && (
        <EditObjectFormTemplate object={getObject.data} {...{ getSchema }} {...{ objectId }} />
      )}

      {getObject.isLoading && <Skeleton height="200px" />}

      <div className={styles.tabContainer}>
        <TabContext value={currentTabs.objectDetailTabs.toString()}>
          <Tabs
            value={currentTabs.objectDetailTabs}
            onChange={(_, newValue: number) => {
              setCurrentTabs({ ...currentTabs, objectDetailTabs: newValue });
            }}
            variant="scrollable"
          >
            <Tab className={styles.tab} label={t("Logs")} value={0} />
            <Tab className={styles.tab} label={t("Sync")} value={1} />
            <Tab className={styles.tab} label={t("Object")} value={2} />
          </Tabs>

          <TabPanel className={styles.tabPanel} value="0">
            {getLogs.isSuccess && (
              <LogsTableTemplate
                logs={getLogs.data.results}
                pagination={{
                  totalPages: getLogs.data.pages,
                  currentPage: currentLogsPage,
                  changePage: setCurrentLogsPage,
                }}
              />
            )}

            {getLogs.isLoading && <Skeleton height="200px" />}
          </TabPanel>

          <TabPanel className={styles.tabPanel} value="1">
            {getObject.isLoading && <Skeleton height="200px" />}
            {getObject.isSuccess && (
              <Button
                label={t("Add sync")}
                variant="primary"
                icon={faPlus}
                onClick={() => navigate(`/objects/${objectId}/new`)}
              />
            )}
            {getSynchronizations.isSuccess && (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeader>Id</TableHeader>
                    <TableHeader>Source</TableHeader>
                    <TableHeader>Action</TableHeader>
                    <TableHeader>ExternalId</TableHeader>
                    <TableHeader>Endpoint</TableHeader>
                    <TableHeader></TableHeader>
                    <TableHeader></TableHeader>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {getSynchronizations.data.map((synchronization: any) => (
                    <TableRow onClick={() => navigate(`${synchronization.id}`)} key={synchronization.id}>
                      <TableCell>{synchronization.id}</TableCell>
                      <TableCell>{synchronization.gateway?.name ?? "-"}</TableCell>
                      <TableCell>{synchronization.action?.name ?? "-"}</TableCell>
                      <TableCell>{synchronization.sourceId ?? "-"}</TableCell>
                      <TableCell>{synchronization.endpoint ?? "-"}</TableCell>
                      <TableCell>
                        <Button
                          variant="danger"
                          label={t("Delete")}
                          icon={faTrash}
                          onClick={(e) => handleDeleteObject(e, synchronization.id)}
                        />
                      </TableCell>
                      <TableCell onClick={() => navigate(`/objects/${objectId}/${synchronization.id}`)}>
                        <Link icon={<FontAwesomeIcon icon={faArrowRight} />} iconAlign="start">
                          {t("Details")}
                        </Link>
                      </TableCell>{" "}
                    </TableRow>
                  ))}
                  {!getSynchronizations.data.length && (
                    <TableRow>
                      <TableCell>{t("No synchronizations found")}</TableCell>
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
            )}
          </TabPanel>

          <TabPanel className={styles.tabPanel} value="2">
            {getObject.isLoading && <Skeleton height="200px" />}
            {getObject.isSuccess && <pre>{JSON.stringify(getObject.data, null, 2)}</pre>}
          </TabPanel>
        </TabContext>
      </div>
    </Container>
  );
};

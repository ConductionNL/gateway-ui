import * as React from "react";
import * as styles from "./ObjectDetailTemplate.module.css";
import { Link, Tab, TabContext, TabPanel, Tabs } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "react-query";
import { useObject } from "../../hooks/object";
import { Container, ToolTip } from "@conduction/components";
import Skeleton from "react-loading-skeleton";
import { EditObjectFormTemplate } from "../templateParts/objectsFormTemplate/EditObjectFormTemplate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { navigate } from "gatsby";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@gemeente-denhaag/table";
import { useSync } from "../../hooks/synchronization";
import { useCurrentTabContext } from "../../context/tabs";
import { useLog } from "../../hooks/log";
import { LogsTableTemplate } from "../templateParts/logsTable/LogsTableTemplate";
import { Button } from "../../components/button/Button";
import { CodeEditor } from "../../components/codeEditor/CodeEditor";
import { formatDateTime } from "../../services/dateTime";
import { CHANNEL_LOG_LIMIT } from "../../apiService/resources/log";
import { ObjectsTable } from "../templateParts/objectsTable/ObjectsTable";

interface ObjectDetailTemplateProps {
  objectId: string;
}

export const ObjectDetailTemplate: React.FC<ObjectDetailTemplateProps> = ({ objectId }) => {
  const { t, i18n } = useTranslation();
  const { currentTabs, setCurrentTabs } = useCurrentTabContext();
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const [currentLogsPage, setCurrentLogsPage] = React.useState<number>(1);
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [objectJsonData, setObjectJsonData] = React.useState<string>("");

  const queryClient = useQueryClient();
  const _useObject = useObject();
  const getObject = _useObject.getOne(objectId);

  const _useSync = useSync(queryClient);
  const getSynchronizations = _useSync.getAll();
  const deleteSync = _useSync.remove();

  const getSchema = _useObject.getSchema(objectId);

  const getLogs = useLog(queryClient).getAllFromChannel("object", objectId, currentLogsPage);

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
        <EditObjectFormTemplate object={getObject.data} schema={getSchema.data} {...{ objectId }} />
      )}

      {(getObject.isLoading || getSchema.isLoading) && <Skeleton height="200px" />}

      <div className={styles.tabContainer}>
        <TabContext value={currentTabs.objectDetailTabs.toString()}>
          <Tabs
            value={currentTabs.objectDetailTabs}
            onChange={(_, newValue: number) => {
              setCurrentTabs({ ...currentTabs, objectDetailTabs: newValue });
            }}
            variant="scrollable"
          >
            <Tab className={styles.tab} label={t("Metadata")} value={0} />
            <Tab className={styles.tab} label={t("Logs")} value={1} />
            <Tab className={styles.tab} label={t("Sync")} value={2} />
            <Tab className={styles.tab} label={t("Object")} value={3} />
            <Tab className={styles.tab} label={t("Related Objects")} value={4} />
          </Tabs>

          <TabPanel className={styles.tabPanel} value="0">
            {getObject.isSuccess && (
              <Table>
                <TableBody>
                  <TableRow>
                    <TableHeader>Id</TableHeader>
                    <TableCell>{getObject.data._self?.id}</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableHeader>Date created</TableHeader>
                    <TableCell className={styles.dateContent}>
                      {formatDateTime(t(i18n.language), getObject.data._self?.dateCreated) ?? "-"}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableHeader>Date modified</TableHeader>
                    <TableCell className={styles.dateContent}>
                      {formatDateTime(t(i18n.language), getObject.data._self?.dateModified) ?? "-"}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableHeader>Owner</TableHeader>
                    <TableCell>
                      <ToolTip tooltip={getObject.data._self?.owner.name ?? ""}>
                        {getObject.data._self?.owner.id ?? "-"}
                      </ToolTip>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableHeader>Organisation</TableHeader>
                    <TableCell>
                      <ToolTip tooltip={getObject.data._self?.organization.name ?? ""}>
                        {getObject.data._self?.organization.id ?? "-"}
                      </ToolTip>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableHeader>Application</TableHeader>
                    <TableCell>
                      <ToolTip tooltip={getObject.data._self?.organization.name ?? ""}>
                        {getObject.data._self?.application.id ?? "-"}
                      </ToolTip>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableHeader>Schema</TableHeader>
                    <TableCell>
                      <span onClick={() => navigate(`/schemas/${getObject.data._self?.schema.id}`)}>
                        <Link icon={<FontAwesomeIcon icon={faArrowRight} />} iconAlign="start">
                          {getObject.data._self?.schema.name ?? "-"}
                        </Link>
                      </span>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            )}
            {getObject.isLoading && <Skeleton height="200px" />}
          </TabPanel>

          <TabPanel className={styles.tabPanel} value="1">
            {getLogs.isSuccess && (
              <LogsTableTemplate
                logs={getLogs.data.results}
                pagination={{
                  data: {
                    count: getLogs.data.results.length,
                    offset: CHANNEL_LOG_LIMIT * (currentLogsPage - 1),
                    pages: getLogs.data.pages,
                    total: getLogs.data.count,
                  },
                  currentPage: currentLogsPage,
                  setCurrentPage: setCurrentLogsPage,
                }}
              />
            )}

            {getLogs.isLoading && <Skeleton height="200px" />}
          </TabPanel>

          <TabPanel className={styles.tabPanel} value="2">
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

          <TabPanel className={styles.tabPanel} value="3">
            {getObject.isLoading && <Skeleton height="200px" />}
            {getObject.isSuccess && (
              <CodeEditor code={JSON.stringify(getObject.data, null, 2)} setCode={setObjectJsonData} readOnly />
            )}
          </TabPanel>

          <TabPanel className={styles.tabPanel} value="4">
            <ObjectsTable
              objectsQuery={getObject}
              pagination={{
                currentPage,
                setCurrentPage,
              }}
              search={{ searchQuery, setSearchQuery }}
            />
          </TabPanel>
        </TabContext>
      </div>
    </Container>
  );
};

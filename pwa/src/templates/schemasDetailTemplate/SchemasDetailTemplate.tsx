import * as React from "react";
import * as styles from "./SchemasDetailTemplate.module.css";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "react-query";
import { Container } from "@conduction/components";
import Skeleton from "react-loading-skeleton";
import { useSchema } from "../../hooks/schema";
import { Button, Link, Tab, TabContext, TabPanel, Tabs } from "@gemeente-denhaag/components-react";
import { ObjectsTable } from "../templateParts/objectsTable/ObjectsTable";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@gemeente-denhaag/table";
import { navigate } from "gatsby";
import { translateDate } from "../../services/dateFormat";
import { faArrowRight, faDownload, faFloppyDisk, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCurrentTabContext } from "../../context/tabs";
import { useDashboardCard } from "../../hooks/useDashboardCard";
import clsx from "clsx";
import { SchemaFormTemplate, formId } from "../templateParts/schemasForm/SchemaFormTemplate";
import { useIsLoadingContext } from "../../context/isLoading";
import { useLog } from "../../hooks/log";
import { LogsTableTemplate } from "../templateParts/logsTable/LogsTableTemplate";
import { FormHeaderTemplate } from "../templateParts/formHeader/FormHeaderTemplate";
import { CHANNEL_LOG_LIMIT } from "../../apiService/resources/log";
import { useObject } from "../../hooks/object";

interface SchemasDetailPageProps {
  schemaId: string;
}

export const SchemasDetailTemplate: React.FC<SchemasDetailPageProps> = ({ schemaId }) => {
  const { t, i18n } = useTranslation();
  const { toggleDashboardCard, getDashboardCard, loading: dashboardLoading } = useDashboardCard();
  const { currentTabs, setCurrentTabs } = useCurrentTabContext();
  const { setIsLoading, isLoading } = useIsLoadingContext();
  const [currentLogsPage, setCurrentLogsPage] = React.useState<number>(1);
  const [currentPage, setCurrentPage] = React.useState<number>(1);

  const queryClient = useQueryClient();
  const _useSchema = useSchema(queryClient);
  const getSchema = _useSchema.getOne(schemaId);
  const deleteSchema = _useSchema.remove();

  const getAllObjectsFromEntity = useObject().getAllFromEntity(schemaId, currentPage);

  const getSchemaSchema = _useSchema.getSchema(schemaId);

  const getLogs = useLog(queryClient).getAllFromChannel("schema", schemaId, currentLogsPage);
  const dashboardCard = getDashboardCard(getSchema.data?.id);

  const toggleFromDashboard = () => {
    toggleDashboardCard(getSchema.data?.name, "schema", "Entity", schemaId, dashboardCard?.id);
  };

  React.useEffect(() => {
    setIsLoading({ schemaForm: deleteSchema.isLoading || getSchema.isLoading || dashboardLoading });
  }, [deleteSchema.isLoading, getSchema.isLoading, dashboardLoading]);

  return (
    <Container layoutClassName={styles.container}>
      <div className={styles.contentContainer}>
        <FormHeaderTemplate
          title={`Edit ${getSchema.data?.name || "Schema"}`}
          disabled={isLoading.schemaForm}
          handleDelete={() => deleteSchema.mutate({ id: schemaId })}
          handleToggleDashboard={{ handleToggle: toggleFromDashboard, isActive: !!dashboardCard }}
          customElements={
            <a
              className={clsx(styles.downloadSchemaButton, [
                (isLoading.schemaForm || !getSchemaSchema.isSuccess) && styles.disabled,
              ])}
              href={`data: text/json;charset=utf-8, ${JSON.stringify(getSchemaSchema.data)}`}
              download="schema.json"
            >
              <Button className={styles.downloadButton} disabled={!getSchemaSchema.isSuccess || isLoading.schemaForm}>
                <FontAwesomeIcon icon={faDownload} />
                Download
              </Button>
            </a>
          }
        />

        <TabContext value={currentTabs.schemaDetailTabs.toString()}>
          <Tabs
            value={currentTabs.schemaDetailTabs}
            onChange={(_, newValue: number) => {
              setCurrentTabs({ ...currentTabs, schemaDetailTabs: newValue });
            }}
            variant="scrollable"
          >
            <Tab className={styles.tab} label={t("Objects")} value={0} disabled={isLoading.schemaForm} />
            <Tab className={styles.tab} label={t("General")} value={1} disabled={isLoading.schemaForm} />
            <Tab className={styles.tab} label={t("Properties")} value={2} disabled={isLoading.schemaForm} />
            <Tab className={styles.tab} label={t("Logs")} value={3} disabled={isLoading.schemaForm} />
          </Tabs>

          <TabPanel className={styles.tabPanel} value="0">
            <Button
              className={styles.addObjectButton}
              onClick={() => navigate(`/objects/new?schema=${schemaId}`)}
              disabled={isLoading.schemaForm}
            >
              <FontAwesomeIcon icon={faPlus} /> {t("Add Object")}
            </Button>

            {getAllObjectsFromEntity.isLoading && <Skeleton height="200px" />}

            {getAllObjectsFromEntity.isSuccess && (
              <ObjectsTable
                objects={getAllObjectsFromEntity}
                pagination={{
                  currentPage,
                  setCurrentPage,
                }}
              />
            )}
          </TabPanel>

          <TabPanel className={styles.tabPanel} value="1">
            {getSchema.isSuccess && (
              <>
                <Button
                  className={clsx(styles.saveSchemaButton)}
                  type="submit"
                  form={formId}
                  disabled={isLoading.schemaForm}
                >
                  <FontAwesomeIcon icon={faFloppyDisk} />
                  {t("Save")}
                </Button>

                <SchemaFormTemplate schema={getSchema.data} />
              </>
            )}

            {getSchema.isLoading && <Skeleton height="200px" />}
            {getSchema.isError && "Error..."}
          </TabPanel>

          <TabPanel className={styles.tabPanel} value="2">
            <Button
              className={styles.addPropertyButton}
              onClick={() => navigate(`/schemas/${schemaId}/new`)}
              disabled={isLoading.schemaForm}
            >
              <FontAwesomeIcon icon={faPlus} /> {t("Add Property")}
            </Button>
            {getSchema.isLoading && <Skeleton height="100px" />}
            {getSchema.isSuccess && (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeader>{t("Name")}</TableHeader>
                    <TableHeader>{t("Type")}</TableHeader>
                    <TableHeader>{t("Function")}</TableHeader>
                    <TableHeader>{t("Case sensitive")}</TableHeader>
                    <TableHeader>{t("Created")}</TableHeader>
                    <TableHeader>{t("Modified")}</TableHeader>
                    <TableHeader />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {getSchema.data.attributes &&
                    getSchema.data.attributes.map((property: any) => (
                      <TableRow onClick={() => navigate(`/schemas/${schemaId}/${property.id}`)} key={property.id}>
                        <TableCell>{property.name ?? "-"}</TableCell>
                        <TableCell>{property.type ?? "-"}</TableCell>
                        <TableCell>{property.function ?? "-"}</TableCell>
                        <TableCell>{property.caseSensitive.toString() ?? "-"}</TableCell>
                        <TableCell>{translateDate(i18n.language, property.dateCreated) ?? "-"}</TableCell>
                        <TableCell>{translateDate(i18n.language, property.dateModified) ?? "-"}</TableCell>
                        <TableCell onClick={() => navigate(`/schemas/${schemaId}/${property.id}`)}>
                          <Link icon={<FontAwesomeIcon icon={faArrowRight} />} iconAlign="start">
                            {t("Details")}
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  {!getSchema.data.attributes?.length && (
                    <TableRow>
                      <TableCell>{t("No properties found")}</TableCell>
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
        </TabContext>
      </div>
    </Container>
  );
};

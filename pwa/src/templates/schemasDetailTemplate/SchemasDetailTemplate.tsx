import * as React from "react";
import * as styles from "./SchemasDetailTemplate.module.css";
import { useTranslation } from "react-i18next";
import { QueryClient } from "react-query";
import { Container } from "@conduction/components";
import Skeleton from "react-loading-skeleton";
import { useSchema } from "../../hooks/schema";
import { EditSchemasFormTemplate } from "../templateParts/schemasForm/EditSchemasFormTemplate";
import { Button, Heading1, Link, Tab, TabContext, TabPanel, Tabs } from "@gemeente-denhaag/components-react";
import { useObject } from "../../hooks/object";
import { ObjectsTable } from "../templateParts/objectsTable/ObjectsTable";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@gemeente-denhaag/table";
import { navigate } from "gatsby";
import { translateDate } from "../../services/dateFormat";
import { ArrowRightIcon } from "@gemeente-denhaag/icons";
import { faDownload, faMinus, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TabsContext } from "../../context/tabs";
import { useDashboardCard } from "../../hooks/useDashboardCard";
import clsx from "clsx";

interface SchemasDetailPageProps {
  schemaId: string;
}

export const SchemasDetailTemplate: React.FC<SchemasDetailPageProps> = ({ schemaId }) => {
  const { t, i18n } = useTranslation();
  const { addOrRemoveDashboardCard, getDashboardCard } = useDashboardCard();
  const [currentTab, setCurrentTab] = React.useContext(TabsContext);
  const [loading, setLoading] = React.useState<boolean>(false);

  const queryClient = new QueryClient();
  const _useSchema = useSchema(queryClient);
  const getSchema = _useSchema.getOne(schemaId);
  const deleteSchema = _useSchema.remove();

  const getSchemaSchema = _useSchema.getSchema(schemaId);

  const dashboardCard = getDashboardCard(getSchema.data?.id);

  const _useObject = useObject(queryClient);
  const getObjectsFromEntity = _useObject.getAllFromEntity(schemaId);

  const handleDeleteSchema = () => {
    const confirmDeletion = confirm("Are you sure you want to delete this action?");

    if (confirmDeletion) {
      deleteSchema.mutate({ id: schemaId });
    }
  };

  const addOrRemoveFromDashboard = () => {
    addOrRemoveDashboardCard(getSchema.data?.name, "Schema", "Entity", schemaId, dashboardCard?.id);
  };

  React.useEffect(() => {
    if (deleteSchema.isLoading || getSchema.isLoading) {
      setLoading(true);
      return;
    }

    setLoading(false);
  }, [deleteSchema.isLoading, getSchema.isLoading]);

  return (
    <Container layoutClassName={styles.container}>
      {getSchema.isError && "Error..."}

      {getSchema.isSuccess && <EditSchemasFormTemplate schema={getSchema.data} {...{ schemaId }} />}
      {getSchema.isLoading && <Skeleton height="200px" />}

      <div className={styles.tabContainer}>
        <TabContext value={currentTab.schemaDetailTabs.toString()}>
          <Tabs
            value={currentTab.schemaDetailTabs}
            onChange={(_, newValue: number) => {
              setCurrentTab({ ...currentTab, schemaDetailTabs: newValue });
            }}
            variant="scrollable"
          >
            <Tab className={styles.tab} label={t("Objects")} value={0} />
            <Tab className={styles.tab} label={t("Properties")} value={1} />
            <Tab className={styles.tab} label={t("Logs")} value={2} />
          </Tabs>

          <TabPanel className={styles.tabPanel} value="0">
            <Button
              className={styles.addObjectButton}
              disabled={getSchema.isLoading}
              onClick={() => navigate(`/objects/new?schema=${getSchema.data.id}`)}
            >
              <FontAwesomeIcon icon={faPlus} /> {t("Add Object")}
            </Button>

            {getObjectsFromEntity.isSuccess && <ObjectsTable objects={getObjectsFromEntity.data.results} />}
            {getObjectsFromEntity.isLoading && <Skeleton height="100px" />}
          </TabPanel>

          <TabPanel className={styles.tabPanel} value="1">
            <Button
              className={styles.addPropertyButton}
              disabled={getSchema.isLoading}
              onClick={() => navigate(`/schemas/${schemaId}/new`)}
            >
              <Tab className={styles.tab} label={t("General")} value={0} />
              <Tab className={styles.tab} label={t("Objects")} value={1} />
              <Tab className={styles.tab} label={t("Properties")} value={2} />
              <Tab className={styles.tab} label={t("Logs")} value={3} />
            </Tabs>

            <TabPanel className={styles.tabPanel} value="0">
              {getSchema.isError && "Error..."}

              {getSchema.isSuccess && <EditSchemasFormTemplate schema={getSchema.data} {...{ schemaId }} />}
              {getSchema.isLoading && <Skeleton height="200px" />}
            </TabPanel>

            <TabPanel className={styles.tabPanel} value="1">
              <Button
                className={styles.addObjectButton}
                disabled={getSchema.isLoading}
                onClick={() => navigate(`/objects/new?schema=${getSchema.data.id}`)}
              >
                <FontAwesomeIcon icon={faPlus} /> {t("Add Object")}
              </Button>

              {getObjectsFromEntity.isSuccess && <ObjectsTable objects={getObjectsFromEntity.data} />}
              {getObjectsFromEntity.isLoading && <Skeleton height="100px" />}
            </TabPanel>

            <TabPanel className={styles.tabPanel} value="2">
              <Button
                className={styles.addPropertyButton}
                disabled={getSchema.isLoading}
                onClick={() => navigate(`/schemas/${schemaId}/new`)}
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
                        <TableRow
                          className={styles.tableRow}
                          onClick={() => navigate(`/schemas/${schemaId}/${property.id}`)}
                          key={property.id}
                        >
                          <TableCell>{property.name ?? "-"}</TableCell>
                          <TableCell>{property.type ?? "-"}</TableCell>
                          <TableCell>{property.function ?? "-"}</TableCell>
                          <TableCell>{property.caseSensitive.toString() ?? "-"}</TableCell>
                          <TableCell>{translateDate(i18n.language, property.dateCreated) ?? "-"}</TableCell>
                          <TableCell>{translateDate(i18n.language, property.dateModified) ?? "-"}</TableCell>
                          <TableCell onClick={() => navigate(`/schemas/${schemaId}/${property.id}`)}>
                            <Link icon={<ArrowRightIcon />} iconAlign="start">
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
              Logs are not yet supported.
            </TabPanel>
          </TabContext>
        </div>
      </Container>
    </>
  );
};

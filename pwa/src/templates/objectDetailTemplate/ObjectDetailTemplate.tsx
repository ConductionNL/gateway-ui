import * as React from "react";
import * as styles from "./ObjectDetailTemplate.module.css";
import { Button, Link, Tab, TabContext, TabPanel, Tabs } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { QueryClient } from "react-query";
import { useObject } from "../../hooks/object";
import { Container } from "@conduction/components";
import Skeleton from "react-loading-skeleton";
import { EditObjectFormTemplate } from "../templateParts/objectsFormTemplate/EditObjectFormTemplate";
import clsx from "clsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { navigate } from "gatsby";
import { useCronjob } from "../../hooks/cronjob";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@gemeente-denhaag/table";
import { useSync } from "../../hooks/synchronization";
import { ArrowRightIcon } from "@gemeente-denhaag/icons";

interface ObjectDetailTemplateProps {
  objectId: string;
}

export const ObjectDetailTemplate: React.FC<ObjectDetailTemplateProps> = ({ objectId }) => {
  const { t } = useTranslation();
  const [currentTab, setCurrentTab] = React.useState<number>(0);

  const queryClient = new QueryClient();
  const _useObject = useObject(queryClient);
  const getObject = _useObject.getOne(objectId);

  const _useSync = useSync(queryClient);
  const getSynchronizations = _useSync.getAll();
  const deleteSync = _useSync.remove();

  const handleDeleteObject = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.TouchEvent<HTMLButtonElement>,
    syncId: string,
  ) => {
    e.stopPropagation();

    const confirmDeletion = confirm("Are you sure you want to delete this action?");

    if (confirmDeletion) {
      deleteSync.mutate({ id: syncId });
    }
  };

  return (
    <Container layoutClassName={styles.container}>
      {getObject.isError && "Error..."}

      {getObject.isSuccess && <EditObjectFormTemplate object={getObject.data} {...{ objectId }} />}

      {getObject.isLoading && <Skeleton height="200px" />}

      <div className={styles.tabContainer}>
        <TabContext value={currentTab.toString()}>
          <Tabs
            value={currentTab}
            onChange={(_, newValue: number) => {
              setCurrentTab(newValue);
            }}
            variant="scrollable"
          >
            <Tab className={styles.tab} label={t("Logs")} value={0} />
            <Tab className={styles.tab} label={t("sync")} value={1} />
          </Tabs>

          <TabPanel className={styles.tabPanel} value="0">
            {getObject.isLoading && <Skeleton height="200px" />}
            {getObject.isSuccess && <span>Logs</span>}
          </TabPanel>
          <TabPanel className={styles.tabPanel} value="1">
            {getObject.isLoading && <Skeleton height="200px" />}
            {getObject.isSuccess && (
              <Button
                className={clsx(styles.buttonIcon, styles.testConnectionButton)}
                onClick={() => navigate(`/objects/${objectId}/new`)}
              >
                <FontAwesomeIcon icon={faPlus} /> {t("Add Sync")}
              </Button>
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
                      <TableCell>{synchronization.source ?? "-"}</TableCell>
                      <TableCell>{synchronization.action?.name ?? "-"}</TableCell>
                      <TableCell>{synchronization.externalId ?? "-"}</TableCell>
                      <TableCell>{synchronization.endpoint ?? "-"}</TableCell>
                      <TableCell>
                        <Button
                          onClick={(e) => handleDeleteObject(e, synchronization.id)}
                          className={clsx(styles.buttonIcon, styles.deleteButton)}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                          {t("Delete")}
                        </Button>
                      </TableCell>
                      <TableCell onClick={() => navigate(`/objects/${objectId}/${synchronization.id}`)}>
                        <Link icon={<ArrowRightIcon />} iconAlign="start">
                          {t("Details")}
                        </Link>
                      </TableCell>{" "}
                    </TableRow>
                  ))}
                  {!getSynchronizations.data.length && (
                    <>
                      <TableRow>
                        <TableCell>{t("No synchronizations found")}</TableCell>
                        <TableCell />
                        <TableCell />
                        <TableCell />
                        <TableCell />
                        <TableCell />
                        <TableCell />
                      </TableRow>
                    </>
                  )}
                </TableBody>
              </Table>
            )}
          </TabPanel>
        </TabContext>
      </div>
    </Container>
  );
};

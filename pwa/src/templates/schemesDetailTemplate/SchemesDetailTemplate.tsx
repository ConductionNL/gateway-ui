import * as React from "react";
import * as styles from "./SchemesDetailTemplate.module.css";
import { useTranslation } from "react-i18next";
import { QueryClient } from "react-query";
import { Container, Tag } from "@conduction/components";
import Skeleton from "react-loading-skeleton";
import { useScheme } from "../../hooks/scheme";
import { EditSchemesFormTemplate } from "../templateParts/schemesForm/EditSchemesFormTemplate";
import { Link, Tab, TabContext, TabPanel, Tabs } from "@gemeente-denhaag/components-react";
import { useObject } from "../../hooks/object";
import { ObjectsTable } from "../templateParts/objectsTable/ObjectsTable";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@gemeente-denhaag/table";
import { navigate } from "gatsby";
import clsx from "clsx";
import { translateDate } from "../../services/dateFormat";
import { ArrowRightIcon } from "@gemeente-denhaag/icons";

interface SchemesDetailPageProps {
  schemeId: string;
}

export const SchemesDetailTemplate: React.FC<SchemesDetailPageProps> = ({ schemeId }) => {
  const { t, i18n } = useTranslation();
  const [currentTab, setCurrentTab] = React.useState<number>(0);

  const queryClient = new QueryClient();
  const _useScheme = useScheme(queryClient);
  const getScheme = _useScheme.getOne(schemeId);

  const _useObject = useObject(queryClient);
  const getObjectsFromEntity = _useObject.getAllFromEntity(schemeId);

  return (
    <Container layoutClassName={styles.container}>
      {getScheme.isError && "Error..."}

      {getScheme.isSuccess && <EditSchemesFormTemplate scheme={getScheme.data} {...{ schemeId }} />}
      {getScheme.isLoading && <Skeleton height="200px" />}

      <div className={styles.tabContainer}>
        <TabContext value={currentTab.toString()}>
          <Tabs
            value={currentTab}
            onChange={(_, newValue: number) => {
              setCurrentTab(newValue);
            }}
            variant="scrollable"
          >
            <Tab className={styles.tab} label={t("Objects")} value={0} />
            <Tab className={styles.tab} label={t("Properties")} value={1} />
            <Tab className={styles.tab} label={t("Logs")} value={2} />
          </Tabs>

          <TabPanel className={styles.tabPanel} value="0">
            {getObjectsFromEntity.isLoading && <Skeleton height="100px" />}
            {getObjectsFromEntity.isSuccess && <ObjectsTable objects={getObjectsFromEntity.data} />}
          </TabPanel>

          <TabPanel className={styles.tabPanel} value="1">
            {getScheme.isLoading && <Skeleton height="100px" />}
            {getScheme.isSuccess && (
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
                  {getScheme.data.attributes.map((property: any) => (
                    <TableRow className={styles.tableRow} key={property.id}>
                      <TableCell>{property.name ?? "-"}</TableCell>
                      <TableCell>{property.type ?? "-"}</TableCell>
                      <TableCell>{property.function ?? "-"}</TableCell>
                      <TableCell>{property.caseSensitive.toString() ?? "-"}</TableCell>
                      <TableCell>{translateDate(i18n.language, property.dateCreated) ?? "-"}</TableCell>
                      <TableCell>{translateDate(i18n.language, property.dateModified) ?? "-"}</TableCell>
                      <TableCell>
                        <Link icon={<ArrowRightIcon />} iconAlign="start">
                          {t("Details")}
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </TabPanel>
          <TabPanel className={styles.tabPanel} value="2">
            Logs are not yet supported.
          </TabPanel>
        </TabContext>
      </div>
    </Container>
  );
};

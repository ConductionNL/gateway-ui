import * as React from "react";
import * as styles from "./SchemesTemplate.module.css";
import { Button, Heading1, Link, Tab, TabContext, TabPanel, Tabs } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@gemeente-denhaag/table";
import { QueryClient } from "react-query";
import { navigate } from "gatsby";
import { Container } from "@conduction/components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Skeleton from "react-loading-skeleton";
import { ArrowRightIcon } from "@gemeente-denhaag/icons";
import { useScheme } from "../../../hooks/scheme";

export const SchemesTemplate: React.FC = () => {
  const { t } = useTranslation();
  const [currentTab, setCurrentTab] = React.useState<number>(0);

  const queryClient = new QueryClient();
  const _useScheme = useScheme(queryClient);
  const getSchemes = _useScheme.getAll();

  return (
    <Container layoutClassName={styles.container}>
      <section className={styles.section}>
        <Heading1>{t("Schemes")}</Heading1>
        <div className={styles.buttons}>
          <Button className={styles.buttonIcon} onClick={() => navigate(`/schemes/new`)}>
            <FontAwesomeIcon icon={faPlus} />
            {t("Add")}
          </Button>
        </div>
      </section>

      {getSchemes.isError && "Error..."}

      {getSchemes.isSuccess && (
        <>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>{t("Name")}</TableHeader>
                <TableHeader></TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {getSchemes.data.map((scheme) => (
                <TableRow className={styles.tableRow} onClick={() => navigate(`/schemes/${scheme.id}`)} key={scheme.id}>
                  <TableCell>{scheme.name}</TableCell>

                  <TableCell onClick={() => navigate(`/schemes/${scheme.id}`)}>
                    <Link icon={<ArrowRightIcon />} iconAlign="start">
                      {t("Details")}
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TabContext value={currentTab.toString()}>
            <Tabs
              value={currentTab}
              onChange={(_, newValue: number) => {
                setCurrentTab(newValue);
              }}
              variant="scrollable"
            >
              <Tab className={styles.tab} label={t("Logs")} value={0} />
            </Tabs>

            <TabPanel className={styles.tabPanel} value="0">
              <span>Logs</span>
            </TabPanel>
          </TabContext>
        </>
      )}
      {getSchemes.isLoading && <Skeleton height="200px" />}
    </Container>
  );
};

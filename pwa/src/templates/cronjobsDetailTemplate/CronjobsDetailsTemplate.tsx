import * as React from "react";
import * as styles from "./CronjobsDetailsTemplate.module.css";
import { useTranslation } from "react-i18next";
import { QueryClient } from "react-query";
import { useCronjob } from "../../hooks/cronjob";
import { Container } from "@conduction/components";
import { EditCronjobFormTemplate } from "../templateParts/cronjobsForm/EditCronjobFormTemplate";
import Skeleton from "react-loading-skeleton";
import { Tab, TabContext, TabPanel, Tabs } from "@gemeente-denhaag/components-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@gemeente-denhaag/table";

interface CronjobDetailPageProps {
  cronjobId: string;
}

export const CronjobsDetailTemplate: React.FC<CronjobDetailPageProps> = ({ cronjobId }) => {
  const { t } = useTranslation();
  const [currentTab, setCurrentTab] = React.useState<number>(0);

  const queryClient = new QueryClient();
  const _useCronjob = useCronjob(queryClient);
  const getCronjob = _useCronjob.getOne(cronjobId);

  return (
    <Container layoutClassName={styles.container}>
      {getCronjob.isError && "Error..."}

      {getCronjob.isSuccess && (
        <>
          <EditCronjobFormTemplate cronjob={getCronjob.data} {...{ cronjobId }} />
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>{t("Subscribed Throws")}</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {getCronjob.data.throws?.length === 0 && <TableCell>-</TableCell>}
              {getCronjob.data.throws?.map((thrown: any) => (
                <TableRow>
                  <TableCell>{thrown}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      )}
      {getCronjob.isLoading && <Skeleton height="200px" />}

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
          </Tabs>

          <TabPanel className={styles.tabPanel} value="0">
            {getCronjob.isLoading && <Skeleton height="200px" />}
            {getCronjob.isSuccess && <span>Logs</span>}{" "}
          </TabPanel>
        </TabContext>
      </div>
    </Container>
  );
};

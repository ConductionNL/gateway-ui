import * as React from "react";
import * as styles from "./SourcesDetailTemplate.module.css";
import { QueryClient } from "react-query";
import _ from "lodash";
import { useSource } from "../../hooks/source";
import { Container } from "@conduction/components";
import { SourcesFormTemplate } from "../templateParts/sourcesForm/EditSourcesFormTemplate";
import Skeleton from "react-loading-skeleton";
import { Link, Tab, TabContext, TabPanel, Tabs } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@gemeente-denhaag/table";
import { navigate } from "gatsby";
import { translateDate } from "../../services/dateFormat";
import { ArrowRightIcon } from "@gemeente-denhaag/icons";

interface SourcesDetailTemplateProps {
  sourceId: string;
}

export const SourcesDetailTemplate: React.FC<SourcesDetailTemplateProps> = ({ sourceId }) => {
  const { t, i18n } = useTranslation();
  const [currentTab, setCurrentTab] = React.useState<number>(0);

  const queryClient = new QueryClient();
  const _useSources = useSource(queryClient);
  const _getSources = _useSources.getOne(sourceId);

  return (
    <Container layoutClassName={styles.container}>
      {_getSources.isLoading && <Skeleton height="200px" />}
      {_getSources.isError && "Error..."}

      {_getSources.isSuccess && <SourcesFormTemplate source={_getSources.data} sourceId={sourceId} />}

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
            {_getSources.isLoading && <Skeleton height="200px" />}
            {_getSources.isSuccess && (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeader>{t("Name")}</TableHeader>
                    <TableHeader>{t("Endpoint")}</TableHeader>
                    <TableHeader>{t("Response Status")}</TableHeader>
                    <TableHeader>{t("Created")}</TableHeader>

                    <TableHeader />
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow
                    className={styles.tableRow}
                    onClick={() => navigate(`/sources/${_getSources.data.id}/${_getSources.data.id}`)}
                    key={_getSources.data.id}
                  >
                    <TableCell>{_getSources.data.name ?? "-"}</TableCell>
                    <TableCell>{_getSources.data.endpoint ?? "-"}</TableCell>
                    <TableCell>{_getSources.data.responceStatus ?? "-"}</TableCell>
                    <TableCell>{translateDate(i18n.language, _getSources.data.dateCreated) ?? "-"}</TableCell>

                    <TableCell onClick={() => navigate(`/sources/${_getSources.data.id}/test`)}>
                      <Link icon={<ArrowRightIcon />} iconAlign="start">
                        {t("Details")}
                      </Link>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            )}
          </TabPanel>
        </TabContext>
      </div>
    </Container>
  );
};

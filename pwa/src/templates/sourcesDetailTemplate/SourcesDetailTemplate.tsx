import * as React from "react";
import * as styles from "./SourcesDetailTemplate.module.css";
import { QueryClient } from "react-query";
import _ from "lodash";
import { useSource } from "../../hooks/source";
import { Container, Tag } from "@conduction/components";
import { SourcesFormTemplate } from "../templateParts/sourcesForm/EditSourcesFormTemplate";
import Skeleton from "react-loading-skeleton";
import { Link, Tab, TabContext, TabPanel, Tabs } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@gemeente-denhaag/table";
import { navigate } from "gatsby";
import { ArrowRightIcon } from "@gemeente-denhaag/icons";
import Alert from "../../components/alert/alert";
import { useCallLog } from "../../hooks/callLog";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getStatusColor, getStatusIcon } from "../../services/getStatusColorAndIcon";
import clsx from "clsx";
import { dateTime } from "../../services/dateTime";
import { AlertContext } from "../../context/alert";

interface SourcesDetailTemplateProps {
  sourceId: string;
}

export const SourcesDetailTemplate: React.FC<SourcesDetailTemplateProps> = ({ sourceId }) => {
  const { t, i18n } = useTranslation();
  const [currentTab, setCurrentTab] = React.useState<number>(0);
  const [alert, setAlert] = React.useContext(AlertContext);

  const queryClient = new QueryClient();
  const _useSources = useSource(queryClient);
  const _useCallLogs = useCallLog(queryClient);
  const _getSources = _useSources.getOne(sourceId);
  const _getCallLogs = _useCallLogs.getSourceLog(sourceId);

  React.useEffect(() => {
    setAlert({ active: false })
  }, [])

  return (
    <Container layoutClassName={styles.container}>
      <Alert />

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
            {_getCallLogs.isLoading && <Skeleton height="200px" />}

            {_getCallLogs.isError && <div>Error cant find call logs.</div>}

            {_getCallLogs.isSuccess && (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeader>{t("Id")}</TableHeader>
                    <TableHeader>{t("Endpoint")}</TableHeader>
                    <TableHeader>{t("Method")}</TableHeader>
                    <TableHeader>{t("Response Status")}</TableHeader>
                    <TableHeader>{t("Created")}</TableHeader>

                    <TableHeader />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {_getCallLogs.data.map((callLog: any) => (
                    <TableRow
                      onClick={() => navigate(`/sources/${_getSources.data.id}/${callLog.id}`)}
                      key={callLog.id}
                    >
                      <TableCell>{callLog.id ?? "-"}</TableCell>
                      <TableCell>{callLog.endpoint ?? "-"}</TableCell>
                      <TableCell>
                        <div className={clsx(styles[`${_.lowerCase(callLog.method)}Tag`])}>
                          <Tag label={callLog.method?.toString() ?? "no known method"} />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div
                          className={clsx(
                            styles[getStatusColor(callLog.responseStatusCode.toString() ?? "no known status")],
                          )}
                        >
                          <Tag
                            icon={
                              <FontAwesomeIcon
                                icon={getStatusIcon(callLog.responseStatusCode.toString() ?? "no known status")}
                              />
                            }
                            label={callLog.responseStatusCode?.toString() ?? "no known status"}
                          />
                        </div>
                      </TableCell>
                      <TableCell>{dateTime(callLog.dateCreated) ?? "-"}</TableCell>

                      <TableCell onClick={() => navigate(`/sources/${callLog.id}/test`)}>
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
        </TabContext>
      </div>
    </Container>
  );
};

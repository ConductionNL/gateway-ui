import * as React from "react";
import * as styles from "./SourcesDetailTemplate.module.css";
import { QueryClient } from "react-query";
import _ from "lodash";
import { useSource } from "../../hooks/source";
import { Container, InputText, SelectSingle, Tag, Textarea } from "@conduction/components";
import { SourcesFormTemplate } from "../templateParts/sourcesForm/EditSourcesFormTemplate";
import Skeleton from "react-loading-skeleton";
import {
  Button,
  FormField,
  FormFieldInput,
  FormFieldLabel,
  Link,
  Tab,
  TabContext,
  TabPanel,
  Tabs,
} from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@gemeente-denhaag/table";
import { navigate } from "gatsby";
import { ArrowRightIcon } from "@gemeente-denhaag/icons";
import { useCallLog } from "../../hooks/callLog";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getStatusColor, getStatusIcon } from "../../services/getStatusColorAndIcon";
import clsx from "clsx";
import { dateTime } from "../../services/dateTime";
import { IsLoadingContext } from "../../context/isLoading";
import { faArrowsRotate } from "@fortawesome/free-solid-svg-icons";
import { useForm } from "react-hook-form";
import { validateStringAsJSON } from "../../services/validateJSON";
import { ErrorMessage } from "../../components/errorMessage/ErrorMessage";
import { TabsContext } from "../../context/tabs";

interface SourcesDetailTemplateProps {
  sourceId: string;
}

export const SourcesDetailTemplate: React.FC<SourcesDetailTemplateProps> = ({ sourceId }) => {
  const { t, i18n } = useTranslation();
  const [currentTab, setCurrentTab] = React.useContext(TabsContext);
  const [isLoading, setIsLoading] = React.useContext(IsLoadingContext);

  const queryClient = new QueryClient();
  const _useSources = useSource(queryClient);
  const _useCallLogs = useCallLog(queryClient);
  const _getSources = _useSources.getOne(sourceId);
  const _getCallLogs = _useCallLogs.getSourceLog(sourceId);
  const _testProxy = _useSources.getProxy(sourceId);

  const methodSelectOptions = [
    { label: "POST", value: "POST" },
    { label: "PUT", value: "PUT" },
    { label: "PATCH", value: "PATCH" },
    { label: "UPDATE", value: "UPDATE" },
    { label: "GET", value: "GET" },
    { label: "DELETE", value: "DELETE" },
  ];

  const onSubmit = (data: any) => {
    const payload = {
      ...data,
      body: data.body ? JSON.parse(data.body) : [],
    };

    const proxyTest = _testProxy.mutate({ id: sourceId, payload: payload });
  };

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  return (
    <Container layoutClassName={styles.container}>
      {_getSources.isLoading && <Skeleton height="200px" />}
      {_getSources.isError && "Error..."}

      {_getSources.isSuccess && <SourcesFormTemplate source={_getSources.data} sourceId={sourceId} />}

      <div className={styles.tabContainer}>
        <TabContext value={currentTab.sourceDetailTabs.toString()}>
          <Tabs
            value={currentTab.sourceDetailTabs}
            onChange={(_, newValue: number) => {
              setCurrentTab({ ...currentTab, sourceDetailTabs: newValue });
            }}
            variant="scrollable"
          >
            <Tab className={styles.tab} label={t("Test Connection")} value={0} />
            <Tab className={styles.tab} label={t("Logs")} value={1} />
          </Tabs>

          <TabPanel className={styles.tabPanel} value="0">
            {_getSources.isLoading && <Skeleton height="200px" />}
            {_getSources.isSuccess && (
              <form onSubmit={handleSubmit(onSubmit)}>
                <Button
                  className={clsx(styles.buttonIcon, styles.testConnectionButton)}
                  disabled={isLoading.alert}
                  type="submit"
                >
                  <FontAwesomeIcon icon={faArrowsRotate} />
                  {t("Test connection")}
                </Button>

                <div className={styles.gridContainer}>
                  <div className={styles.grid}>
                    <FormField>
                      <FormFieldInput>
                        <FormFieldLabel>{t("Method")}</FormFieldLabel>
                        {/* @ts-ignore */}
                        <SelectSingle
                          validation={{ required: true }}
                          {...{ register, errors, control }}
                          name="method"
                          options={methodSelectOptions}
                        />

                        {errors["method"] && <ErrorMessage message="This field is required." />}
                      </FormFieldInput>
                    </FormField>
                    <FormField>
                      <FormFieldInput>
                        <FormFieldLabel>{t("Endpoint")}</FormFieldLabel>
                        <InputText {...{ register, errors }} name="endpoint" />
                      </FormFieldInput>
                    </FormField>
                    <FormField>
                      <FormFieldInput>
                        <FormFieldLabel>{t("Body")}</FormFieldLabel>
                        <Textarea
                          {...{ register, errors }}
                          name="body"
                          validation={{ validate: validateStringAsJSON }}
                        />
                        {errors["body"] && <ErrorMessage message={errors["body"].message} />}
                      </FormFieldInput>
                    </FormField>
                  </div>
                </div>
              </form>
            )}
          </TabPanel>

          <TabPanel className={styles.tabPanel} value="1">
            {_getCallLogs.isLoading && <Skeleton height="200px" />}

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
                      <TableCell>{dateTime(t(i18n.language), callLog.dateCreated) ?? "-"}</TableCell>
                      <TableCell onClick={() => navigate(`/sources/${callLog.id}/test`)}>
                        <Link icon={<ArrowRightIcon />} iconAlign="start">
                          {t("Details")}
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                  {!_getCallLogs.data.length && (
                    <>
                      <TableRow>
                        <TableCell>Geen logs gevonden</TableCell>
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

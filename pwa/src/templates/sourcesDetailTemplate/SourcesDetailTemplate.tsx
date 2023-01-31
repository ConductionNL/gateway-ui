import * as React from "react";
import * as styles from "./SourcesDetailTemplate.module.css";
import { QueryClient } from "react-query";
import _ from "lodash";
import { useSource } from "../../hooks/source";
import { Container, InputText, SelectSingle, Tag, Textarea } from "@conduction/components";
import Skeleton from "react-loading-skeleton";
import {
  Button,
  FormField,
  FormFieldInput,
  FormFieldLabel,
  Heading1,
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
import { faArrowsRotate, faFloppyDisk, faMinus, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useForm } from "react-hook-form";
import { validateStringAsJSON } from "../../services/validateJSON";
import { ErrorMessage } from "../../components/errorMessage/ErrorMessage";
import { TabsContext } from "../../context/tabs";
import { SourceFormTemplate, formId } from "../templateParts/sourcesForm/SourceFormTemplate";
import { useDashboardCard } from "../../hooks/useDashboardCard";

interface SourcesDetailTemplateProps {
  sourceId: string;
}

export const SourcesDetailTemplate: React.FC<SourcesDetailTemplateProps> = ({ sourceId }) => {
  const { t, i18n } = useTranslation();
  const [currentTab, setCurrentTab] = React.useContext(TabsContext);
  const [isLoading, setIsLoading] = React.useContext(IsLoadingContext);

  const queryClient = new QueryClient();
  const _useSource = useSource(queryClient);
  const _useCallLog = useCallLog(queryClient);

  const getSource = _useSource.getOne(sourceId);
  const getCallLog = _useCallLog.getSourceLog(sourceId);
  const deleteSource = _useSource.remove();
  const testProxy = _useSource.getProxy(sourceId);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { toggleDashboardCard, getDashboardCard, loading: dashboardLoading } = useDashboardCard();

  const dashboardCard = getDashboardCard(getSource.data?.id);

  const toggleFromDashboard = () => {
    toggleDashboardCard(getSource.data.name, "source", "Gateway", sourceId, dashboardCard?.id);
  };

  const handleDelete = (id: string): void => {
    const confirmDeletion = confirm("Are you sure you want to delete this source?");

    confirmDeletion && deleteSource.mutateAsync({ id: id });
  };

  const onSubmit = (data: any) => {
    const payload = {
      ...data,
      body: data.body ? JSON.parse(data.body) : [],
    };

    testProxy.mutate({ id: sourceId, payload: payload });
  };

  React.useEffect(() => {
    setIsLoading({ ...isLoading, sourceForm: deleteSource.isLoading || testProxy.isLoading || dashboardLoading });
  }, [deleteSource.isLoading, testProxy.isLoading, dashboardLoading]);

  return (
    <Container layoutClassName={styles.container}>
      {getSource.isLoading && <Skeleton height="200px" />}
      {getSource.isError && "Error..."}

      {getSource.isSuccess && (
        <>
          <section className={styles.section}>
            <Heading1>{`Edit ${getSource.data.name}`}</Heading1>

            <div className={styles.buttons}>
              <Button
                type="submit"
                form={formId}
                disabled={isLoading.sourceForm}
                className={clsx(styles.buttonIcon, styles.button)}
              >
                <FontAwesomeIcon icon={faFloppyDisk} />
                {t("Save")}
              </Button>

              <Button
                className={clsx(styles.buttonIcon, styles.button)}
                onClick={toggleFromDashboard}
                disabled={isLoading.sourceForm}
              >
                <FontAwesomeIcon icon={dashboardCard ? faMinus : faPlus} />
                {dashboardCard ? t("Remove from dashboard") : t("Add to dashboard")}
              </Button>

              <Button
                className={clsx(styles.buttonIcon, styles.button, styles.deleteButton)}
                onClick={() => handleDelete(getSource.data.id)}
                disabled={isLoading.sourceForm}
              >
                <FontAwesomeIcon icon={faTrash} />
                {t("Delete")}
              </Button>
            </div>
          </section>

          <SourceFormTemplate source={getSource.data} />
        </>
      )}

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
            {getSource.isLoading && <Skeleton height="200px" />}
            {getSource.isSuccess && (
              <form onSubmit={handleSubmit(onSubmit)}>
                <Button
                  className={clsx(styles.buttonIcon, styles.testConnectionButton)}
                  disabled={isLoading.sourceForm}
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
                        <SelectSingle
                          validation={{ required: true }}
                          {...{ register, errors, control }}
                          name="method"
                          options={methodSelectOptions}
                          disabled={isLoading.sourceForm}
                        />

                        {errors["method"] && <ErrorMessage message="This field is required." />}
                      </FormFieldInput>
                    </FormField>
                    <FormField>
                      <FormFieldInput>
                        <FormFieldLabel>{t("Endpoint")}</FormFieldLabel>
                        <InputText {...{ register, errors }} name="endpoint" disabled={isLoading.sourceForm} />
                      </FormFieldInput>
                    </FormField>
                    <FormField>
                      <FormFieldInput>
                        <FormFieldLabel>{t("Body")}</FormFieldLabel>
                        <Textarea
                          {...{ register, errors }}
                          name="body"
                          validation={{ validate: validateStringAsJSON }}
                          disabled={isLoading.sourceForm}
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
            {getCallLog.isLoading && <Skeleton height="200px" />}

            {getCallLog.isSuccess && (
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
                  {getCallLog.data.map((callLog: any) => (
                    <TableRow onClick={() => navigate(`/sources/${getSource.data.id}/${callLog.id}`)} key={callLog.id}>
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
                  {!getCallLog.data.length && (
                    <>
                      <TableRow>
                        <TableCell>{t("No logs found")}</TableCell>
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

const methodSelectOptions = [
  { label: "POST", value: "POST" },
  { label: "PUT", value: "PUT" },
  { label: "PATCH", value: "PATCH" },
  { label: "UPDATE", value: "UPDATE" },
  { label: "GET", value: "GET" },
  { label: "DELETE", value: "DELETE" },
];

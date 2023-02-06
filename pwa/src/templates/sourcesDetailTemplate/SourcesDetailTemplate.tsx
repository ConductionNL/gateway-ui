import * as React from "react";
import * as styles from "./SourcesDetailTemplate.module.css";
import { QueryClient } from "react-query";
import _ from "lodash";
import { useSource } from "../../hooks/source";
import { Container, InputText, SelectSingle, Textarea } from "@conduction/components";
import Skeleton from "react-loading-skeleton";
import {
  Button,
  FormField,
  FormFieldInput,
  FormFieldLabel,
  Heading1,
  Tab,
  TabContext,
  TabPanel,
  Tabs,
} from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import { IsLoadingContext } from "../../context/isLoading";
import { faArrowsRotate, faFloppyDisk, faMinus, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useForm } from "react-hook-form";
import { validateStringAsJSON } from "../../services/validateJSON";
import { ErrorMessage } from "../../components/errorMessage/ErrorMessage";
import { TabsContext } from "../../context/tabs";
import { SourceFormTemplate, formId } from "../templateParts/sourcesForm/SourceFormTemplate";
import { useDashboardCard } from "../../hooks/useDashboardCard";
import { useLog } from "../../hooks/log";
import { LogsTableTemplate } from "../templateParts/logsTable/LogsTableTemplate";

interface SourcesDetailTemplateProps {
  sourceId: string;
}

export const SourcesDetailTemplate: React.FC<SourcesDetailTemplateProps> = ({ sourceId }) => {
  const { t, i18n } = useTranslation();
  const [currentTab, setCurrentTab] = React.useContext(TabsContext);
  const [isLoading, setIsLoading] = React.useContext(IsLoadingContext);

  const queryClient = new QueryClient();
  const _useSource = useSource(queryClient);

  const getLogs = useLog(queryClient).getAllFromChannel("source", sourceId);

  const getSource = _useSource.getOne(sourceId);
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
            {getLogs.isSuccess && <LogsTableTemplate logs={getLogs.data.results} />}

            {getLogs.isLoading && <Skeleton height="200px" />}
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

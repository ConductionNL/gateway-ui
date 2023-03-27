import * as React from "react";
import * as styles from "./MappingDetailsTemplate.module.css";
import { Container, ToolTip } from "@conduction/components";
import { MappingFormTemplate, formId } from "../templateParts/mappingForm/MappingFormTemplate";
import { useMapping } from "../../hooks/mapping";
import { useQueryClient } from "react-query";
import { useIsLoadingContext } from "../../context/isLoading";
import { useDashboardCard } from "../../hooks/useDashboardCard";
import Skeleton from "react-loading-skeleton";
import { FormHeaderTemplate } from "../templateParts/formHeader/FormHeaderTemplate";
import { useCurrentTabContext } from "../../context/tabs";
import { useTranslation } from "react-i18next";
import { Tab, TabContext, TabPanel, Tabs } from "@gemeente-denhaag/components-react";
import { faArrowsRotate, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { Button } from "../../components/button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CodeEditor } from "../../components/codeEditor/CodeEditor";
import { useLog } from "../../hooks/log";
import { LogsTableTemplate } from "../templateParts/logsTable/LogsTableTemplate";

interface MappingDetailsTemplateProps {
  mappingId: string;
}

export const MappingDetailTemplate: React.FC<MappingDetailsTemplateProps> = ({ mappingId }) => {
  const { t } = useTranslation();
  const [mappingTestInput, setMappingTestInput] = React.useState<string>("");
  const { currentTabs, setCurrentTabs } = useCurrentTabContext();
  const { setIsLoading, isLoading } = useIsLoadingContext();
  const { toggleDashboardCard, getDashboardCard, loading: dashboardLoading } = useDashboardCard();
  const [testMappingData, setTestMappingData] = React.useState<object>();

  const queryClient = useQueryClient();
  const getMapping = useMapping(queryClient).getOne(mappingId);
  const deleteMapping = useMapping(queryClient).remove();
  const testMapping = useMapping(queryClient).testMapping(mappingId);

  const [currentLogsPage, setCurrentLogsPage] = React.useState<number>(1);
  const getLogs = useLog().getAllFromChannel("mapping", mappingId, currentLogsPage);

  const dashboardCard = getDashboardCard(mappingId);

  const toggleFromDashboard = () => {
    toggleDashboardCard(getMapping.data.name, "mapping", "Mapping", mappingId, dashboardCard?.id);
  };

  const submitMappingTest = () => {
    try {
      testMapping.mutate({ payload: { ...JSON.parse(mappingTestInput) }, id: mappingId });
    } catch {
      alert("Invalid JSON supplied, update the object and try again");
    }
  };

  React.useEffect(() => {
    setIsLoading({
      ...isLoading,
      mappingForm: deleteMapping.isLoading || testMapping.isLoading || dashboardLoading,
    });
  }, [deleteMapping.isLoading, testMapping.isLoading, dashboardLoading]);

  React.useEffect(() => {
    testMapping.isSuccess && setTestMappingData(testMapping.data);
  }, [testMapping.isSuccess]);

  return (
    <Container layoutClassName={styles.container}>
      {getMapping.isLoading && <Skeleton height="200px" />}
      {getMapping.isSuccess && (
        <>
          <FormHeaderTemplate
            title={`Edit ${getMapping.data.name}`}
            {...{ formId }}
            disabled={isLoading.mappingForm}
            handleDelete={() => deleteMapping.mutate({ id: mappingId })}
            handleToggleDashboard={{ handleToggle: toggleFromDashboard, isActive: !!dashboardCard }}
            showTitleTooltip
          />

          <div className={styles.tabContainer}>
            <TabContext value={currentTabs.mappingDetailTabs.toString()}>
              <Tabs
                value={currentTabs.mappingDetailTabs}
                onChange={(_, newValue: number) => {
                  setCurrentTabs({ ...currentTabs, mappingDetailTabs: newValue });
                }}
                variant="scrollable"
              >
                <Tab className={styles.tab} label={t("General")} value={0} />
                <Tab className={styles.tab} label={t("Test Mappings")} value={1} />
                <Tab className={styles.tab} label={t("Logs")} value={2} />
              </Tabs>

              <TabPanel className={styles.tabPanel} value="0">
                <MappingFormTemplate mapping={getMapping.data} />
              </TabPanel>

              <TabPanel className={styles.tabPanel} value="1">
                <div className={styles.content}>
                  <Button
                    label={t("Test mapping")}
                    icon={faArrowsRotate}
                    variant="primary"
                    disabled={isLoading.mappingForm || !mappingTestInput}
                    onClick={submitMappingTest}
                  />

                  <div className={styles.inputContent}>
                    <div className={styles.inputTitle}>
                      {t("Input")}
                      <ToolTip tooltip="The input is the JSON code you want to test the mapping with.">
                        <FontAwesomeIcon icon={faInfoCircle} />
                      </ToolTip>
                    </div>

                    <CodeEditor code={mappingTestInput} setCode={setMappingTestInput} />
                  </div>
                  <div className={styles.outputContent}>
                    <div> {t("Output")}</div>
                    {testMappingData && <pre>{JSON.stringify(testMappingData, null, 2)}</pre>}
                    {!testMappingData && (
                      <div>When the mapping has been succesfully tested the output will be shown here.</div>
                    )}
                  </div>
                </div>
              </TabPanel>

              <TabPanel className={styles.tabPanel} value="2">
                {getLogs.isLoading && <Skeleton height="200px" />}

                {getLogs.isSuccess && (
                  <LogsTableTemplate
                    logs={getLogs.data.results}
                    pagination={{
                      totalPages: getLogs.data.pages,
                      currentPage: currentLogsPage,
                      changePage: setCurrentLogsPage,
                    }}
                  />
                )}
              </TabPanel>
            </TabContext>
          </div>
        </>
      )}
    </Container>
  );
};

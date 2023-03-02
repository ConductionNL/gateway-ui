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
import {
  FormField,
  FormFieldInput,
  FormFieldLabel,
  Tab,
  TabContext,
  TabPanel,
  Tabs,
} from "@gemeente-denhaag/components-react";
import { useForm } from "react-hook-form";
import { faArrowsRotate, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { ErrorMessage } from "../../components/errorMessage/ErrorMessage";
import { Button } from "../../components/button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface MappingDetailsTemplateProps {
  mappingId: string;
}

export const MappingDetailTemplate: React.FC<MappingDetailsTemplateProps> = ({ mappingId }) => {
  const { t } = useTranslation();

  const { currentTabs, setCurrentTabs } = useCurrentTabContext();
  const { setIsLoading, isLoading } = useIsLoadingContext();
  const { toggleDashboardCard, getDashboardCard, loading: dashboardLoading } = useDashboardCard();
  const [testMappingData, setTestMappingData] = React.useState<object>();

  const [code, setCode] = React.useState<string>("");

  const queryClient = useQueryClient();
  const getMapping = useMapping(queryClient).getOne(mappingId);
  const deleteMapping = useMapping(queryClient).remove();
  const testMapping = useMapping(queryClient).testMapping(mappingId);

  const dashboardCard = getDashboardCard(mappingId);

  const {
    handleSubmit,
    formState: { errors },
  } = useForm();

  const toggleFromDashboard = () => {
    toggleDashboardCard(getMapping.data.name, "mapping", "Mapping", mappingId, dashboardCard?.id);
  };

  const onSubmitTest = (data: any) => {
    const jsonData = data.input ? JSON.parse(data.input) : [];

    const payload = {
      ...jsonData,
    };

    testMapping.mutate({ payload: payload, id: mappingId });
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
              </Tabs>

              <TabPanel className={styles.tabPanel} value="0">
                <MappingFormTemplate mapping={getMapping.data} />
              </TabPanel>

              <TabPanel className={styles.tabPanel} value="1">
                <form onSubmit={handleSubmit(onSubmitTest)} className={styles.testMappingForm}>
                  <Button
                    label={t("Test mapping")}
                    icon={faArrowsRotate}
                    variant="primary"
                    disabled={isLoading.mappingForm}
                    type="submit"
                  />

                  <div className={styles.content}>
                    <FormField>
                      <FormFieldInput>
                        <div className={styles.formFieldInfoHeader}>
                          <FormFieldLabel>{t("Input")}</FormFieldLabel>
                          <ToolTip tooltip="The input is the JSON code you want to test the mapping with.">
                            <FontAwesomeIcon icon={faInfoCircle} />
                          </ToolTip>
                        </div>

                        <CodeEditor />

                        {errors["input"] && <ErrorMessage message={errors["input"].message} />}
                      </FormFieldInput>
                    </FormField>
                    <FormField>
                      <FormFieldLabel>{t("Output")}</FormFieldLabel>
                      {testMappingData && <pre>{JSON.stringify(testMappingData, null, 2)}</pre>}
                      {!testMappingData && (
                        <div>When the mapping has been succesfully tested the output will be shown here.</div>
                      )}
                    </FormField>
                  </div>
                </form>
              </TabPanel>
            </TabContext>
          </div>
        </>
      )}
    </Container>
  );
};

import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-yaml";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";

const CodeEditor: React.FC = () => {
  const [code, setCode] = React.useState<string>("");

  return (
    <AceEditor
      mode="json"
      theme="github"
      onChange={(value) => setCode(value)}
      fontSize={14}
      showPrintMargin={true}
      showGutter={true}
      highlightActiveLine={true}
      value={code}
      setOptions={{
        enableBasicAutocompletion: true,
        enableLiveAutocompletion: true,
        enableSnippets: false,
        showLineNumbers: true,
        tabSize: 2,
      }}
    />
  );
};

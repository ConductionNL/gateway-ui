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
import CodeEditor from "@uiw/react-textarea-code-editor";

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

  const handleDelete = () => {
    const confirmDeletion = confirm("Are you sure you want to delete this mapping?");

    confirmDeletion && deleteMapping.mutate({ id: mappingId });
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
            handleDelete={handleDelete}
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

                        <CodeEditor
                          value={code}
                          language="json"
                          placeholder="Type or paste the JSON code you want to test the mapping with."
                          onChange={(evn) => setCode(evn.target.value)}
                          padding={14}
                          style={{
                            fontSize: 16,
                            backgroundColor: "#ffffff",
                            fontFamily: "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
                          }}
                          minHeight={150}
                          className={styles.testMappingInputField}
                          disabled={isLoading.mappingForm}
                        />

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

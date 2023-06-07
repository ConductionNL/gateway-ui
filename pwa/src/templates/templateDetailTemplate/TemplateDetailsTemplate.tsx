import * as React from "react";
import * as styles from "./TemplateDetailsTemplate.module.css";
import { useTranslation } from "react-i18next";
import { useTemplate } from "../../hooks/template";
import { useQueryClient } from "react-query";
import { Container } from "@conduction/components";
import Skeleton from "react-loading-skeleton";
import { Tab, TabContext, TabPanel, Tabs } from "@gemeente-denhaag/components-react";
import { TemplateFormTemplate, formId } from "../templateParts/templatesForm/TemplateFormTemplate";
import { useIsLoadingContext } from "../../context/isLoading";
import { useDashboardCard } from "../../hooks/useDashboardCard";
import { FormHeaderTemplate } from "../templateParts/formHeader/FormHeaderTemplate";
import { useLog } from "../../hooks/log";
import { LogsTableTemplate } from "../templateParts/logsTable/LogsTableTemplate";
import { CHANNEL_LOG_LIMIT } from "../../apiService/resources/log";

interface TemplateDetailsTemplateProps {
  templateId: string;
}

export const TemplateDetailsTemplate: React.FC<TemplateDetailsTemplateProps> = ({ templateId }) => {
  const { t } = useTranslation();
  const [currentTab, setCurrentTab] = React.useState<number>(0);
  const { setIsLoading, isLoading } = useIsLoadingContext();
  const [currentLogsPage, setCurrentLogsPage] = React.useState<number>(1);

  const queryClient = useQueryClient();
  const _useTemplate = useTemplate(queryClient);

  const getTemplate = _useTemplate.getOne(templateId);
  const deleteTemplate = _useTemplate.remove();

  const getLogs = useLog(queryClient).getAllFromChannel("template", templateId, currentLogsPage);

  const { toggleDashboardCard, getDashboardCard, loading: dashboardToggleLoading } = useDashboardCard();

  const dashboardCard = getDashboardCard(templateId);

  const toggleFromDashboard = () => {
    toggleDashboardCard(getTemplate.data.name, "template", "Template", templateId, dashboardCard?.id);
  };

  React.useEffect(() => {
    setIsLoading({ ...isLoading, actionForm: deleteTemplate.isLoading || dashboardToggleLoading });
  }, [deleteTemplate.isLoading, dashboardToggleLoading]);

  return (
    <Container layoutClassName={styles.container}>
      {getTemplate.isError && "Error..."}

      {getTemplate.isSuccess && (
        <>
          <FormHeaderTemplate
            title={`Edit ${getTemplate.data.name}`}
            {...{ formId }}
            disabled={isLoading.actionForm}
            handleDelete={() => deleteTemplate.mutate({ id: templateId })}
            handleToggleDashboard={{ handleToggle: toggleFromDashboard, isActive: !!dashboardCard }}
            showTitleTooltip
          />

          <TemplateFormTemplate template={getTemplate.data} />
        </>
      )}
      {getTemplate.isLoading && <Skeleton height="200px" />}

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
            {getLogs.isLoading && <Skeleton height="200px" />}

            {getLogs.isSuccess && (
              <LogsTableTemplate
                logs={getLogs.data.results}
                pagination={{
                  data: {
                    count: getLogs.data.results.length,
                    offset: CHANNEL_LOG_LIMIT * (currentLogsPage - 1),
                    pages: getLogs.data.pages,
                    total: getLogs.data.total,
                  },
                  currentPage: currentLogsPage,
                  setCurrentPage: setCurrentLogsPage,
                }}
              />
            )}
          </TabPanel>
        </TabContext>
      </div>
    </Container>
  );
};

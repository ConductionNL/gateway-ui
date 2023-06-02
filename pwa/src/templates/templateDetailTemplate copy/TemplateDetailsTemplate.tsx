import * as React from "react";
import * as styles from "./TemplateDetailsTemplate.module.css";
import { useTranslation } from "react-i18next";
import { useAction } from "../../hooks/action";
import { useQueryClient } from "react-query";
import { Container } from "@conduction/components";
import Skeleton from "react-loading-skeleton";
import { Tab, TabContext, TabPanel, Tabs } from "@gemeente-denhaag/components-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@gemeente-denhaag/table";
import { TemplateFormTemplate, formId } from "../templateParts/templatesForm/TemplateFormTemplate";
import action from "../../apiService/resources/action";
import { useIsLoadingContext } from "../../context/isLoading";
import { useDashboardCard } from "../../hooks/useDashboardCard";
import { FormHeaderTemplate } from "../templateParts/formHeader/FormHeaderTemplate";
import { useLog } from "../../hooks/log";
import { LogsTableTemplate } from "../templateParts/logsTable/LogsTableTemplate";
import { Button } from "../../components/button/Button";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { CHANNEL_LOG_LIMIT } from "../../apiService/resources/log";

interface TemplateDetailsTemplateProps {
  templateId: string;
}

export const TemplateDetailsTemplate: React.FC<TemplateDetailsTemplateProps> = ({ templateId }) => {
  const { t } = useTranslation();
  const [currentTab, setCurrentTab] = React.useState<number>(0);
  // const { setIsLoading, isLoading } = useIsLoadingContext();
  // const [currentLogsPage, setCurrentLogsPage] = React.useState<number>(1);

  // const queryClient = useQueryClient();
  // const _useAction = useAction(queryClient);

  // const getAction = _useAction.getOne(actionId);
  // const deleteAction = _useAction.remove();
  // const runAction = _useAction.runAction(actionId);

  // const getLogs = useLog(queryClient).getAllFromChannel("action", actionId, currentLogsPage);

  // const { toggleDashboardCard, getDashboardCard, loading: dashboardToggleLoading } = useDashboardCard();

  // const dashboardCard = getDashboardCard(actionId);

  // const toggleFromDashboard = () => {
  //   toggleDashboardCard(action.name, "action", "Action", actionId, dashboardCard?.id);
  // };

  // const handleRunAction = (data: any) => {
  //   runAction.mutate({ payload: data, id: actionId });
  // };

  // React.useEffect(() => {
  //   setIsLoading({ ...isLoading, actionForm: deleteAction.isLoading || dashboardToggleLoading });
  // }, [deleteAction.isLoading, dashboardToggleLoading]);

  return (
    <Container layoutClassName={styles.container}>
      {/* {getAction.isError && "Error..."} */}

      {/* {getAction.isSuccess && ( */}
        <>
          <FormHeaderTemplate
            title={"Edit ${getAction.data.name}"}
            {...{ formId }}
            // disabled={isLoading.actionForm}
            // handleDelete={() => deleteAction.mutate({ id: actionId })}
            // handleToggleDashboard={{ handleToggle: toggleFromDashboard, isActive: !!dashboardCard }}
            showTitleTooltip
            // customElements={
            //   <Button label={t("Run")} icon={faPlay} variant="success" onClick={() => handleRunAction({})} />
            // }
          />

          <TemplateFormTemplate template={templateId} />

          
        </>
      {/* )} */}
      {/* {getAction.isLoading && <Skeleton height="200px" />} */}

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
            {/* {getLogs.isLoading && <Skeleton height="200px" />} */}

            {/* {getLogs.isSuccess && (
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
            )} */}
          </TabPanel>
        </TabContext>
      </div>
    </Container>
  );
};

import * as React from "react";
import * as styles from "./ActionsDetailsTemplate.module.css";
import { useTranslation } from "react-i18next";
import { useAction } from "../../hooks/action";
import { QueryClient } from "react-query";
import { Container } from "@conduction/components";
import Skeleton from "react-loading-skeleton";
import { Tab, TabContext, TabPanel, Tabs } from "@gemeente-denhaag/components-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@gemeente-denhaag/table";
import { ActionFormTemplate, formId } from "../templateParts/actionsForm/ActionFormTemplate";
import action from "../../apiService/resources/action";
import { IsLoadingContext } from "../../context/isLoading";
import { useDashboardCard } from "../../hooks/useDashboardCard";
import { FormHeaderTemplate } from "../templateParts/formHeader/FormHeaderTemplate";

interface ActionsDetailsTemplateProps {
  actionId: string;
}

export const ActionsDetailTemplate: React.FC<ActionsDetailsTemplateProps> = ({ actionId }) => {
  const { t } = useTranslation();
  const [currentTab, setCurrentTab] = React.useState<number>(0);
  const [isLoading, setIsLoading] = React.useContext(IsLoadingContext);

  const queryClient = new QueryClient();
  const _useAction = useAction(queryClient);
  const getAction = _useAction.getOne(actionId);
  const deleteAction = _useAction.remove();

  const { toggleDashboardCard, getDashboardCard, loading: dashboardToggleLoading } = useDashboardCard();

  const dashboardCard = getDashboardCard(actionId);

  const toggleFromDashboard = () => {
    toggleDashboardCard(action.name, "action", "Action", actionId, dashboardCard?.id);
  };

  const handleDeleteAction = () => {
    const confirmDeletion = confirm("Are you sure you want to delete this action?");

    confirmDeletion && deleteAction.mutate({ id: actionId });
  };

  React.useEffect(() => {
    setIsLoading({ ...isLoading, actionForm: deleteAction.isLoading || dashboardToggleLoading });
  }, [deleteAction.isLoading, dashboardToggleLoading]);

  return (
    <Container layoutClassName={styles.container}>
      {getAction.isError && "Error..."}

      {getAction.isSuccess && (
        <>
          <FormHeaderTemplate
            title={`Edit ${getAction.data.name}`}
            {...{ formId }}
            disabled={isLoading.actionForm}
            handleDelete={handleDeleteAction}
            handleToggleDashboard={{ handleToggle: toggleFromDashboard, isActive: !!dashboardCard }}
          />

          <ActionFormTemplate action={getAction.data} />

          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>{t("Subscribed Throws")}</TableHeader>
              </TableRow>
            </TableHead>

            <TableBody>
              {getAction.data.throws.map((thrown: any, idx: number) => (
                <TableRow key={idx}>
                  <TableCell>{thrown}</TableCell>
                </TableRow>
              ))}

              {!getAction.data.throws.length && (
                <TableRow>
                  <TableCell>No subscribed throws.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </>
      )}
      {getAction.isLoading && <Skeleton height="200px" />}

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
            {getAction.isLoading && <Skeleton height="200px" />}
            {getAction.isSuccess && <span>Logs</span>}
          </TabPanel>
        </TabContext>
      </div>
    </Container>
  );
};

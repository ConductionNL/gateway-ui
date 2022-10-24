import * as React from "react";
import * as styles from "./ActionsDetailsTemplate.module.css";
import { useTranslation } from "react-i18next";
import { useAction } from "../../hooks/action";
import { QueryClient } from "react-query";
import { Container } from "@conduction/components";
import Skeleton from "react-loading-skeleton";
import { EditActionFormTemplate } from "../templateParts/actionsForm/EditActionFormTemplate";
import { Tab, TabContext, TabPanel, Tabs } from "@gemeente-denhaag/components-react";

interface ActionsDetailsTemplateProps {
  actionId: string;
}

export const ActionsDetailTemplate: React.FC<ActionsDetailsTemplateProps> = ({ actionId }) => {
  const { t } = useTranslation();
  const [currentTab, setCurrentTab] = React.useState<number>(0);

  const queryClient = new QueryClient();
  const _useActions = useAction(queryClient);
  const getActions = _useActions.getOne(actionId);

  return (
    <Container layoutClassName={styles.container}>
      {getActions.isError && "Error..."}

      {getActions.isSuccess && <EditActionFormTemplate action={getActions.data} {...{ actionId }} />}
      {getActions.isLoading && <Skeleton height="200px" />}

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
            {getActions.isLoading && <Skeleton height="200px" />}
            {getActions.isSuccess && <span>Logs</span>}{" "}
          </TabPanel>
        </TabContext>
      </div>
    </Container>
  );
};
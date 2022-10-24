import * as React from "react";
import * as styles from "./SourcesDetailTemplate.module.css";
import { QueryClient } from "react-query";
import _ from "lodash";
import { useSource } from "../../hooks/source";
import { Container } from "@conduction/components";
import { SourcesFormTemplate } from "../templateParts/sourcesForm/EditSourcesFormTemplate";
import Skeleton from "react-loading-skeleton";
import { Tab, TabContext, TabPanel, Tabs } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";

interface SourcesDetailTemplateProps {
  sourceId: string;
}

export const SourcesDetailTemplate: React.FC<SourcesDetailTemplateProps> = ({ sourceId }) => {
  const { t } = useTranslation();
  const [currentTab, setCurrentTab] = React.useState<number>(0);

  const queryClient = new QueryClient();
  const _useSources = useSource(queryClient);
  const _getSources = _useSources.getOne(sourceId);

  return (
    <Container layoutClassName={styles.container}>
      {_getSources.isLoading && <Skeleton height="200px" />}
      {_getSources.isError && "Error..."}

      {_getSources.isSuccess && <SourcesFormTemplate source={_getSources.data} sourceId={sourceId} />}

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
            {_getSources.isLoading && <Skeleton height="200px" />}
            {_getSources.isSuccess && <span>Logs</span>}{" "}
          </TabPanel>
        </TabContext>
      </div>
    </Container>
  );
};

import * as React from "react";
import * as styles from "./EndpointDetailsTemplate.module.css";
import { useTranslation } from "react-i18next";
import { QueryClient } from "react-query";
import { useEndpoint } from "../../../hooks/endpoint";
import { Container } from "@conduction/components";
import Skeleton from "react-loading-skeleton";
import { EditEndpointFormTemplate } from "../endpointsForm/EditEndpointsFormTemplate";
import { Tab, TabContext, TabPanel, Tabs } from "@gemeente-denhaag/components-react";

interface EndpointDetailsTemplateProps {
  endpointId: string;
}

export const EndpointDetailTemplate: React.FC<EndpointDetailsTemplateProps> = ({ endpointId }) => {
  const { t } = useTranslation();
  const [currentTab, setCurrentTab] = React.useState<number>(0);

  const queryClient = new QueryClient();
  const _useEndpoints = useEndpoint(queryClient);
  const getEndpoints = _useEndpoints.getOne(endpointId);

  return (
    <Container layoutClassName={styles.container}>
      {getEndpoints.isLoading && <Skeleton height="200px" />}
      {getEndpoints.isError && "Error..."}

      {getEndpoints.isSuccess && (
        <>
          <EditEndpointFormTemplate endpoint={getEndpoints.data} {...{ endpointId }} />
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
              <span>Logs</span>
            </TabPanel>
          </TabContext>
        </>
      )}
    </Container>
  );
};

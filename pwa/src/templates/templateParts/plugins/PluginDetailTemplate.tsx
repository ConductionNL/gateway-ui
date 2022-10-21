import * as React from "react";
import * as styles from "./PluginDetailTemplate.module.css";
import { useTranslation } from "react-i18next";
import { QueryClient } from "react-query";
import { Container } from "@conduction/components";
import Skeleton from "react-loading-skeleton";
import { EditPluginFormTemplate } from "../pluginsForm/EditPluginFormTemplate";

interface PluginDetailPageProps {
  pluginId: string;
}

export const PluginDetailTemplate: React.FC<PluginDetailPageProps> = ({ pluginId }) => {
  const { t } = useTranslation();

  const queryClient = new QueryClient();
  const _usePlugin = usePlugin(queryClient);
  const getPlugins = _usePlugin.getOne(pluginId);

  return (
    <Container layoutClassName={styles.container}>
      {getPlugins.isLoading && <Skeleton height="200px" />}
      {getPlugins.isError && "Error..."}

      {getPlugins.isSuccess && <EditPluginFormTemplate plugin={getPlugins.data} {...{ pluginId }} />}
    </Container>
  );
};

import * as React from "react";
import * as styles from "./PluginDetailTemplate.module.css";
import { useTranslation } from "react-i18next";
import { QueryClient } from "react-query";
import { Container } from "@conduction/components";
import Skeleton from "react-loading-skeleton";
import { EditPluginFormTemplate } from "../pluginsForm/EditPluginFormTemplate";
import { TEMPORARY_PLUGINS } from "../../../data/plugin";

interface PluginDetailPageProps {
  pluginId: string;
}

export const PluginDetailTemplate: React.FC<PluginDetailPageProps> = ({ pluginId }) => {
  const { t } = useTranslation();

  const tempPlugin = TEMPORARY_PLUGINS.find((plugin) => {
    return plugin.id === pluginId;
  });

  return (
    <Container layoutClassName={styles.container}>
      {!tempPlugin && "Error..."}

      {tempPlugin && <EditPluginFormTemplate plugin={tempPlugin} {...{ pluginId }} />}
    </Container>
  );
};

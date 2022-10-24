import * as React from "react";
import * as styles from "./PluginsDetailTemplate.module.css";
import { useTranslation } from "react-i18next";
import { Container } from "@conduction/components";
import { EditPluginFormTemplate } from "../templateParts/pluginsForm/EditPluginFormTemplate";
import { TEMPORARY_PLUGINS } from "../../data/plugin";

interface PluginsDetailPageProps {
  pluginId: string;
}

export const PluginsDetailTemplate: React.FC<PluginsDetailPageProps> = ({ pluginId }) => {
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

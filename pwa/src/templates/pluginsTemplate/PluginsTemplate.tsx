import * as React from "react";
import * as styles from "./PluginsTemplate.module.css";
import { Button, Heading1 } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { navigate } from "gatsby";
import { Container, InputText } from "@conduction/components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { PluginCard } from "../../components/pluginCard/PluginCard";
import _ from "lodash";
import { QueryClient } from "react-query";
import { usePlugin } from "../../hooks/plugin";
import Skeleton from "react-loading-skeleton";
import { PluginsSearchBarTemplate } from "./PluginsSearchBarTemplate";

export type TPluginTitle = "Installed" | "Search" | "";

interface PluginsPageProps {
  title: TPluginTitle;
}

export const PluginsTemplate: React.FC<PluginsPageProps> = ({ title }) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = React.useState<string>("");

  const queryClient = new QueryClient();
  const _usePlugin = usePlugin(queryClient);
  let getPlugins;

  switch (title) {
    case "Installed":
      getPlugins = _usePlugin.getAllInstalled();
      break;

    case "Search":
      getPlugins = _usePlugin.getAllAvailable(searchQuery);
      break;

    default:
      getPlugins = _usePlugin.getAllAvailable(searchQuery);
    //   getPlugins = _usePlugin.getAllInstalled(); // change to this one once stable
  }

  const titleHref = title !== "" ? `${_.lowerCase(title)}/` : "";

  return (
    <Container layoutClassName={styles.container}>
      <section className={styles.section}>
        <Heading1>{t(`${title} Plugins`)}</Heading1>
      </section>

      {title === "Search" && <PluginsSearchBarTemplate {...{ searchQuery, setSearchQuery }} />}

      {getPlugins.isSuccess && (
        <>
          <div className={styles.cardsGrid}>
            {!getPlugins.data[0] && <span>{("No plugins found")}</span>}
            {getPlugins.data.map((plugin: any, idx: number) => (
              <PluginCard
                key={idx}
                title={{
                  label: plugin.name,
                  href: `/plugins/${titleHref}${plugin.name.replace("/", "_")}`,
                }}
                description={plugin.description}
                packagistUrl={plugin.url}
                repositoryUrl={plugin.Repository}
                downloads={plugin.downloads.total}
                favers={plugin.favers}
              />
            ))}
          </div>
        </>
      )}

      {getPlugins.isLoading && <Skeleton height="200px" />}
      {getPlugins.isError && <>Oops, something went wrong...</>}
    </Container>
  );
};

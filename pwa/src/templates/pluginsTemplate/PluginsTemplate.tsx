import * as React from "react";
import * as styles from "./PluginsTemplate.module.css";
import { Button, Heading1 } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { navigate } from "gatsby";
import { Container, InputText } from "@conduction/components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSearch } from "@fortawesome/free-solid-svg-icons";
import { PluginCard } from "../../components/pluginCard/PluginCard";
import _ from "lodash";
import { useQueryClient } from "react-query";
import { usePlugin } from "../../hooks/plugin";
import Skeleton from "react-loading-skeleton";
import { PluginsSearchBarTemplate } from "./PluginsSearchBarTemplate";

export type TPluginTitle = "Search" | "";

interface PluginsPageProps {
  title: TPluginTitle;
}

export const PluginsTemplate: React.FC<PluginsPageProps> = ({ title }) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = React.useState<string>("");

  const queryClient = useQueryClient();
  const _usePlugin = usePlugin(queryClient);
  let getPlugins;

  switch (title) {
    case "Search":
      getPlugins = _usePlugin.getAllAvailable(searchQuery);
      break;

    default:
      getPlugins = _usePlugin.getAllInstalled();
  }

  const titleHref = title !== "" ? `${_.lowerCase(title)}/` : "";

  return (
    <Container layoutClassName={styles.container}>
      <section className={styles.section}>
        <Heading1>{t(`${title} Plugins`)}</Heading1>
        {!!title || (
          <Button icon={<FontAwesomeIcon icon={faSearch} />} onClick={() => navigate("/plugins/search")}>
            {t("Search")}
          </Button>
        )}
      </section>

      {title === "Search" && <PluginsSearchBarTemplate {...{ searchQuery, setSearchQuery }} />}

      {getPlugins.isSuccess && (
        <>
          <div className={styles.cardsGrid}>
            {!getPlugins.data[0] && <span>{"No plugins found"}</span>}
            {getPlugins.data.map((plugin: any, idx: number) => (
              <PluginCard
                key={idx}
                title={{
                  label: plugin.name,
                  href: `/plugins/${titleHref}${plugin.name.replace("/", "_")}`,
                }}
                description={plugin.description}
                packagistUrl={plugin.url}
                repositoryUrl={plugin.repository}
                downloads={plugin.downloads.total}
                favers={plugin.favers}
                license={plugin.license}
                homepageUrl={plugin.homepage}
                installed={plugin.version ? true : false}
                update={plugin.update}
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

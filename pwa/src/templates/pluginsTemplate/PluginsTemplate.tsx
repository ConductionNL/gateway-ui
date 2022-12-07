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
import { PaginatedItems } from "../../components/pagination/pagination";
import { GatsbyContext } from "../../context/gatsby";

export type TPluginTitle = "Installed" | "Search" | "";

interface PluginsPageProps {
  title: TPluginTitle;
}

export const PluginsTemplate: React.FC<PluginsPageProps> = ({ title }) => {
  const { t } = useTranslation();
  const { screenSize } = React.useContext(GatsbyContext);
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const [marginPagesDisplayed, setMarginPageDisplayed] = React.useState<number>(5);
  const [searchQuery, setSearchQuery] = React.useState<string>("");

  const queryClient = new QueryClient();
  const _usePlugin = usePlugin(queryClient);
  let getPlugins: any;

  switch (title) {
    case "Installed":
      getPlugins = _usePlugin.getAllInstalled();
      break;

    case "Search":
      getPlugins = _usePlugin.getAllAvailable(searchQuery, currentPage);
      break;

    default:
      getPlugins = _usePlugin.getAllInstalled();
  }

  const titleHref = !!title ? `${_.lowerCase(title)}/` : "";

  /*
    Plugins Available endpoint need a limit query param
  */

  React.useEffect(() => {
    if (getPlugins.isSuccess && screenSize === "mobile") {
      setMarginPageDisplayed(3);
    }
    // if (getPlugins.isSuccess && screenSize === "mobile" && getPlugins.data.pages > 100) {
    //   setMarginPageDisplayed(2);
    // }
    if (getPlugins.isSuccess && screenSize !== "mobile") {
      setMarginPageDisplayed(5);
    }
  }, [getPlugins]);

  return (
    <Container layoutClassName={styles.container}>
      <section className={styles.section}>
        <Heading1>{t(`${title} Plugins`)}</Heading1>
        <div className={styles.buttons}>
          <Button className={styles.buttonIcon} onClick={() => navigate(`/plugins/new`)}>
            <FontAwesomeIcon icon={faPlus} />
            {t("Add")}
          </Button>
        </div>
      </section>

      {title === "Search" && <PluginsSearchBarTemplate {...{ searchQuery, setSearchQuery }} />}

      {getPlugins.isSuccess && (
        <>
          <div className={styles.cardsGrid}>
            {!getPlugins.data[0] && <span>{t("No plugins found")}</span>}
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
                downloads={plugin.downloads}
                favers={plugin.favers}
              />
            ))}
          </div>

          {!!getPlugins.data && !!title && title !== "Installed" && (
            <PaginatedItems
              pages={10}
              currentPage={currentPage}
              setPage={setCurrentPage}
              pageRangeDisplayed={2}
              marginPagesDisplayed={marginPagesDisplayed}
            />
          )}
        </>
      )}

      {getPlugins.isLoading && <Skeleton height="200px" />}
      {getPlugins.isError && <>Oops, something went wrong...</>}
    </Container>
  );
};

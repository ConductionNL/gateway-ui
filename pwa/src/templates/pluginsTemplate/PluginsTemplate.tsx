import * as React from "react";
import * as styles from "./PluginsTemplate.module.css";
import { Button, Heading1 } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { navigate } from "gatsby";
import { Container } from "@conduction/components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { PluginCard } from "../../components/pluginCard/PluginCard";
import _ from "lodash";
import { QueryClient } from "react-query";
import { usePlugin } from "../../hooks/plugin";
import Skeleton from "react-loading-skeleton";
import ReactPaginate from "react-paginate";

export type TPluginTitle = "Installed" | "Search" | "";

interface PluginsPageProps {
  title: TPluginTitle;
}

export const PluginsTemplate: React.FC<PluginsPageProps> = ({ title }) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = React.useState<string>("")

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
      getPlugins = _usePlugin.getAllInstalled();
  }

  const pluginsPerPage = 10;

  const titleHref = title !== "" ? `${_.lowerCase(title)}/` : "";

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

      {getPlugins.isSuccess && (
        <>
          {/* <PaginatedPlugins {...{ pluginsPerPage, getPlugins }} /> */}

          <div className={styles.cardsGrid}>
            {getPlugins.data.map((plugin: any, idx: number) => (
              <PluginCard
                key={idx}
                title={{
                  label: plugin.name,
                  href: `/plugins/${titleHref}${plugin.name.replace(/\//g, "_")}`,
                }}
                description={plugin.description}
                packagistUrl={plugin.url}
                repositoryUrl={plugin.Repository}
                downloads={plugin.downloads}
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

interface PaginatedPluginsProps {
  pluginsPerPage: number;
  getPlugins: any;
}

const PaginatedPlugins: React.FC<PaginatedPluginsProps> = ({ pluginsPerPage, getPlugins }) => {
  const [currentPage, setCurrentPage] = React.useState<number>(0);

  const endOffset = currentPage + pluginsPerPage;
  const currentItems = getPlugins.data.slice(currentPage, endOffset);
  const pageCount = Math.ceil(getPlugins.data.length / pluginsPerPage);

  const handlePageClick = (event: any) => {
    const newOffset = (event.selected * pluginsPerPage) % getPlugins.data.length;
    setCurrentPage(newOffset);
  };

  return (
    <>
      <ReactPaginate
        breakLabel="..."
        nextLabel="next >"
        onPageChange={handlePageClick}
        pageRangeDisplayed={5}
        pageCount={pageCount}
        previousLabel="< previous"
        renderOnZeroPageCount={() => null}
      />
    </>
  );
};

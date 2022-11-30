import * as React from "react";
import * as styles from "./PluginsTemplate.module.css";
import { Button, Heading1 } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { navigate } from "gatsby";
import { Container } from "@conduction/components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { TEMPORARY_PLUGINS } from "../../data/plugin";
import { PluginCard } from "../../components/pluginCard/PluginCard";
import _ from "lodash";

export type TPluginTitle = "Installed" | "Search" | "";

interface PluginsPageProps {
  title: TPluginTitle;
}

export const PluginsTemplate: React.FC<PluginsPageProps> = ({ title }) => {
  const { t } = useTranslation();

  const tempPlugin = TEMPORARY_PLUGINS.filter((plugin) => {
    const installed = title === "Installed" ? true : false;

    if (title === "") {
      return TEMPORARY_PLUGINS;
    }

    return plugin.installed === installed;
  });

  const installed = title === "Installed" ? true : false;
  let _pluginId = "";
  if (installed) {
    _pluginId = "a66533fc-386b-45a4-9795-2007057cae18";
  }
  if (!installed) {
    _pluginId = "eff8f013-9fea-4abd-b24c-48241b807d01";
  } else {
    _pluginId = "a66533fc-386b-45a4-9795-2007057cae18";
  }

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

      {!tempPlugin && "Error..."}

      {tempPlugin && (
        <div className={styles.cardsGrid}>
          {tempPlugin.map((plugin: any) => (
            <>
              <PluginCard
                title={{
                  label: plugin.name,
                  href: `/plugins/${titleHref}${_pluginId}`,
                }}
                description={plugin.description}
                packagistUrl={plugin.url}
                repositoryUrl={plugin.Repository}
                downloads={plugin.downloads}
                favers={plugin.favers}
              />
            </>
          ))}
        </div>
      )}
    </Container>
  );
};

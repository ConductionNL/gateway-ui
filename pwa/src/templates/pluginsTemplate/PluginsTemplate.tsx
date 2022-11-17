import * as React from "react";
import * as styles from "./PluginsTemplate.module.css";
import { Button, Heading1, Link } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@gemeente-denhaag/table";
import { navigate } from "gatsby";
import { Container } from "@conduction/components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { ArrowRightIcon } from "@gemeente-denhaag/icons";
import { TEMPORARY_PLUGINS } from "../../data/plugin";
import { PluginCard } from "../../components/pluginCard/PluginCard";

export const PluginsTemplate: React.FC = () => {
  const { t } = useTranslation();

  const tempPlugin = TEMPORARY_PLUGINS;

  return (
    <Container layoutClassName={styles.container}>
      <section className={styles.section}>
        <Heading1>{t("Installed Plugins")}</Heading1>
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
              {console.log(plugin)}
              <PluginCard
                title={{
                  label: plugin.name,
                  href: `/plugins/a66533fc-386b-45a4-9795-2007057cae18`,
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

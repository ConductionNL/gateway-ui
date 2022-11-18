import * as React from "react";
import * as styles from "./PluginsDetailTemplate.module.css";
import { useTranslation } from "react-i18next";
import { Container } from "@conduction/components";
import { TEMPORARYDETAIL_PLUGINS } from "../../data/pluginDetail";
import { Button, Heading1, LeadParagraph } from "@gemeente-denhaag/components-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsRotate, faDownload, faTrash } from "@fortawesome/free-solid-svg-icons";
import clsx from "clsx";

interface PluginsDetailPageProps {
  pluginId: string;
}

export const PluginsDetailTemplate: React.FC<PluginsDetailPageProps> = ({ pluginId }) => {
  const { t } = useTranslation();

  const tempPlugin = TEMPORARYDETAIL_PLUGINS.find((plugin) => {
    return plugin.id === pluginId;
  });

  return (
    <Container layoutClassName={styles.container}>
      {!tempPlugin && "Error..."}
      {tempPlugin && (
        <div className={styles.content}>
          <section className={styles.section}>
            <Heading1 className={styles.title}>{tempPlugin.name}</Heading1>

            {tempPlugin.installed && (
              <div className={styles.buttons}>
                <Button className={styles.buttonIcon} type="submit">
                  <FontAwesomeIcon icon={faArrowsRotate} />
                  {t("Update")}
                </Button>

                <Button className={clsx(styles.buttonIcon, styles.deleteButton)}>
                  <FontAwesomeIcon icon={faTrash} />
                  {t("Remove")}
                </Button>
              </div>
            )}
            {console.log(tempPlugin.installed)}
            {!tempPlugin.installed && (
              <div className={styles.buttons}>
                <Button className={styles.buttonIcon}>
                  <FontAwesomeIcon icon={faDownload} />
                  {t("Install")}
                </Button>
              </div>
            )}
          </section>

          <LeadParagraph>{tempPlugin.description}</LeadParagraph>

          <section className={styles.data}>
            <div>Type: {tempPlugin.type}</div>

            <div>
              Versions:
              {tempPlugin.versions.map((versions: any) => (
                <li>{versions}</li>
              ))}
            </div>

            <div>
              Licenses:
              {tempPlugin.licenses.map((licenses: any) => (
                <li>{licenses.name}</li>
              ))}
            </div>

            <div>
              <span>Requires :</span>
              {Object.entries(tempPlugin.requires).map(([key, value]) => (
                <li>
                  <span>
                    {key}: {value}
                  </span>
                </li>
              ))}
            </div>

            <div>
              <span>DevRequires :</span>
              {Object.entries(tempPlugin.devRequires).map(([key, value]) => (
                <li>
                  <span>
                    {key}: {value}
                  </span>
                </li>
              ))}
            </div>

            <div>
              <span>source :</span>

              {Object.entries(tempPlugin.source).map(([key, value]) => (
                <li>
                  <span>
                    {key}: {value}
                  </span>
                </li>
              ))}
            </div>

            <div>
              <span>dist :</span>

              {Object.entries(tempPlugin.dist).map(([key, value]) => (
                <li>
                  <span>
                    {key}: {value}
                  </span>
                </li>
              ))}
            </div>

            <div>
              <span>Support :</span>

              {Object.entries(tempPlugin.support).map(([key, value]) => (
                <li>
                  <span>
                    {key}: {value}
                  </span>
                </li>
              ))}
            </div>
          </section>
        </div>
      )}
    </Container>
  );
};

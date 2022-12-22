import * as React from "react";
import * as styles from "./PluginsDetailTemplate.module.css";
import { useTranslation } from "react-i18next";
import { Container, Tag, ToolTip } from "@conduction/components";
import {
  Button,
  Divider,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  LeadParagraph,
  Link,
  Paragraph,
} from "@gemeente-denhaag/components-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsRotate, faDownload, faTrash } from "@fortawesome/free-solid-svg-icons";
import clsx from "clsx";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@gemeente-denhaag/table";
import _ from "lodash";
import { QueryClient } from "react-query";
import { usePlugin } from "../../hooks/plugin";
import Skeleton from "react-loading-skeleton";
import { CircleIndicatorTemplate } from "../templateParts/ratingIndicator/CircleIndicatorTemplate";
import { ExternalLinkIcon } from "@gemeente-denhaag/icons";

interface PluginsDetailPageProps {
  pluginName: string;
  installed: boolean;
}

export const PluginsDetailTemplate: React.FC<PluginsDetailPageProps> = ({ pluginName, installed }) => {
  const { t } = useTranslation();

  const queryClient = new QueryClient();
  const _usePlugin = usePlugin(queryClient);
  const getPlugin = _usePlugin.getOne(pluginName.replace("_", "/"));
  const deletePlugin = _usePlugin.remove();

  const handleDeletePlugin = () => {
    const confirmDeletion = confirm("Are you sure you want to delete this action?");

    if (confirmDeletion) {
      deletePlugin.mutate({ name: pluginName.replace("_", "/") });
    }
  };

  return (
    <>
      <Container layoutClassName={styles.container}>
        {getPlugin.isLoading && <Skeleton height="200px" />}
        {getPlugin.isError && "Error..."}
        {getPlugin.isSuccess && (
          <div className={styles.gatewayDetailContainer}>
            <section className={styles.section}>
              <Heading1 className={styles.title}>{getPlugin.data.name}</Heading1>

              {installed && (
                <div className={styles.buttons}>
                  <Button className={styles.buttonIcon} type="submit">
                    <FontAwesomeIcon icon={faArrowsRotate} />
                    {t("Update")}
                  </Button>

                  <Button onClick={handleDeletePlugin} className={clsx(styles.buttonIcon, styles.deleteButton)}>
                    <FontAwesomeIcon icon={faTrash} />
                    {t("Remove")}
                  </Button>
                </div>
              )}
              {!installed && (
                <div className={styles.buttons}>
                  <Button className={styles.buttonIcon}>
                    <FontAwesomeIcon icon={faDownload} />
                    {t("Install")}
                  </Button>
                </div>
              )}
            </section>

            <div>
              <div className={styles.type}>
                <p>{`Type: ${getPlugin.data?.type}`}</p>
                <p>{`Language: ${getPlugin.data?.language}`}</p>
              </div>

              <div>
                <Paragraph>{getPlugin.data?.description}</Paragraph>
              </div>
            </div>

            <div>
              <h3>Downloads</h3>
              <div className={styles.cardsContainer}>
                <div className={styles.card}>
                  <Heading4>Total</Heading4>
                  <div className={styles.cardContent}>
                    <CircleIndicatorTemplate
                      layoutClassName={styles.downloadIndicatorContainer}
                      value={getPlugin.data?.downloads.total}
                    />
                  </div>
                </div>

                <div className={styles.card}>
                  <Heading4>Monthly</Heading4>
                  <div className={styles.cardContent}>
                    <CircleIndicatorTemplate
                      layoutClassName={styles.downloadIndicatorContainer}
                      maxValue={getPlugin.data?.downloads.total}
                      value={getPlugin.data?.downloads.monthly}
                    />
                  </div>
                </div>

                <div className={styles.card}>
                  <Heading4>Daily</Heading4>
                  <div className={styles.cardContent}>
                    <CircleIndicatorTemplate
                      layoutClassName={styles.downloadIndicatorContainer}
                      maxValue={getPlugin.data?.downloads.total}
                      value={getPlugin.data?.downloads.daily}
                    />
                  </div>
                </div>
              </div>
            </div>

            <Divider />

            <div>
              <h3 onClick={() => open(getPlugin.data.repository)}>
                <Link icon={<ExternalLinkIcon />}>Github</Link>
              </h3>
              <div className={styles.cardsContainer}>
                <div className={styles.card}>
                  <Heading4>Forks</Heading4>
                  <div className={styles.cardContent}>
                    <Heading1>{getPlugin.data.github_forks}</Heading1>
                  </div>
                </div>

                <div className={styles.card}>
                  <Heading4>Stars</Heading4>
                  <div className={styles.cardContent}>
                    <Heading1>{getPlugin.data.github_stars}</Heading1>
                  </div>
                </div>

                <div className={styles.card}>
                  <Heading4>Watchers</Heading4>
                  <div className={styles.cardContent}>
                    <Heading1>{getPlugin.data.github_watchers}</Heading1>
                  </div>
                </div>

                <div className={styles.card}>
                  <Heading4>Open issues</Heading4>
                  <div className={styles.cardContent}>
                    <Heading1>{getPlugin.data.github_open_issues}</Heading1>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.cardsContainer}>
              <div className={styles.card}>
                <Heading4>Dependents</Heading4>
                <div className={styles.cardContent}>
                  <Heading1>{getPlugin.data.dependents}</Heading1>
                </div>
              </div>

              <div className={styles.card}>
                <Heading4>Faves</Heading4>
                <div className={styles.cardContent}>
                  <Heading1>{getPlugin.data.favers}</Heading1>
                </div>
              </div>

              <div className={styles.card}>
                <Heading4>Suggesters</Heading4>
                <div className={styles.cardContent}>
                  <Heading1>{getPlugin.data.suggesters}</Heading1>
                </div>
              </div>
            </div>
          </div>
        )}
      </Container>
    </>
  );
};

import * as React from "react";
import * as styles from "./GatewayDetailTemplate.module.css";
import {
  Button,
  Divider,
  Heading1,
  Heading2,
  Heading4,
  Link,
  Paragraph,
} from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { Container } from "@conduction/components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsRotate } from "@fortawesome/free-solid-svg-icons";
import _ from "lodash";
import { QueryClient } from "react-query";
import { usePlugin } from "../../hooks/plugin";
import Skeleton from "react-loading-skeleton";
import { CircleIndicatorTemplate } from "../templateParts/ratingIndicator/CircleIndicatorTemplate";
import { ExternalLinkIcon } from "@gemeente-denhaag/icons";

export const GatewayDetailTemplate: React.FC = () => {
  const { t } = useTranslation();

  const queryClient = new QueryClient();
  const _usePlugin = usePlugin(queryClient);
  const getPlugins = _usePlugin.getView();

  return (
    <Container layoutClassName={styles.container}>
      <section className={styles.section}>
        <Heading1>{t("Gateway Detail")}</Heading1>
        <div className={styles.buttons}>
          <Button className={styles.buttonIcon}>
            <FontAwesomeIcon icon={faArrowsRotate} />
            {t("Upgrade")}
          </Button>
        </div>
      </section>

      {getPlugins.isError && "Error..."}

      {getPlugins.isSuccess && (
        <div className={styles.gatewayDetailContainer}>
          <div>
            <Heading2>{getPlugins.data?.name}</Heading2>

            <div className={styles.type}>
              <p>{`Type: ${getPlugins.data?.type}`}</p>
              <p>{`Language: ${getPlugins.data?.language}`}</p>
            </div>

            <div>
              <Paragraph>{getPlugins.data?.description}</Paragraph>
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
                    value={getPlugins.data?.downloads.total}
                  />
                </div>
              </div>

              <div className={styles.card}>
                <Heading4>Monthly</Heading4>
                <div className={styles.cardContent}>
                  <CircleIndicatorTemplate
                    layoutClassName={styles.downloadIndicatorContainer}
                    maxValue={getPlugins.data?.downloads.total}
                    value={getPlugins.data?.downloads.monthly}
                  />
                </div>
              </div>

              <div className={styles.card}>
                <Heading4>Daily</Heading4>
                <div className={styles.cardContent}>
                  <CircleIndicatorTemplate
                    layoutClassName={styles.downloadIndicatorContainer}
                    maxValue={getPlugins.data?.downloads.total}
                    value={getPlugins.data?.downloads.daily}
                  />
                </div>
              </div>
            </div>
          </div>

          <Divider />

          <div>
            <h3 onClick={() => open(getPlugins.data.repository)}>
              <Link icon={<ExternalLinkIcon />}>Github</Link>
            </h3>
            <div className={styles.cardsContainer}>
              <div className={styles.card}>
                <Heading4>Forks</Heading4>
                <div className={styles.cardContent}>
                  <Heading1>{getPlugins.data.github_forks}</Heading1>
                </div>
              </div>

              <div className={styles.card}>
                <Heading4>Stars</Heading4>
                <div className={styles.cardContent}>
                  <Heading1>{getPlugins.data.github_stars}</Heading1>
                </div>
              </div>

              <div className={styles.card}>
                <Heading4>Watchers</Heading4>
                <div className={styles.cardContent}>
                  <Heading1>{getPlugins.data.github_watchers}</Heading1>
                </div>
              </div>

              <div className={styles.card}>
                <Heading4>Open issues</Heading4>
                <div className={styles.cardContent}>
                  <Heading1>{getPlugins.data.github_open_issues}</Heading1>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.cardsContainer}>
            <div className={styles.card}>
              <Heading4>Dependents</Heading4>
              <div className={styles.cardContent}>
                <Heading1>{getPlugins.data.dependents}</Heading1>
              </div>
            </div>

            <div className={styles.card}>
              <Heading4>Faves</Heading4>
              <div className={styles.cardContent}>
                <Heading1>{getPlugins.data.favers}</Heading1>
              </div>
            </div>

            <div className={styles.card}>
              <Heading4>Suggesters</Heading4>
              <div className={styles.cardContent}>
                <Heading1>{getPlugins.data.suggesters}</Heading1>
              </div>
            </div>
          </div>
        </div>
      )}

      {getPlugins.isLoading && <Skeleton height="200px" />}
    </Container>
  );
};

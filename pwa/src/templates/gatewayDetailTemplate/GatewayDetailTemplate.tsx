import * as React from "react";
import * as styles from "./GatewayDetailTemplate.module.css";
import { Button, Heading1, Heading2, Heading3, Heading4, Link, Paragraph } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { Container } from "@conduction/components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsRotate } from "@fortawesome/free-solid-svg-icons";
import _ from "lodash";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@gemeente-denhaag/table";
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
              <p>{`Dependents: ${getPlugins.data?.dependents}`}</p>
            </div>

            <div className={styles.descriptionAndRepo}>
              <Paragraph>{getPlugins.data?.description}</Paragraph>

              <Paragraph>
                go to{" "}
                <span onClick={() => open(getPlugins.data.repository)}>
                  <Link icon={<ExternalLinkIcon />}>
                    repository
                  </Link>
                </span>
              </Paragraph>
            </div>
          </div>

          <Heading3>Downloads</Heading3>
          <div className={styles.downloads}>
            <div>
              <Heading4>Total</Heading4>
              <CircleIndicatorTemplate
                layoutClassName={styles.downloadIndicatorContainer}
                value={getPlugins.data?.downloads.total}
              />
            </div>

            <div>
              <Heading4>Monthly</Heading4>
              <CircleIndicatorTemplate
                layoutClassName={styles.downloadIndicatorContainer}
                maxValue={getPlugins.data?.downloads.total}
                value={getPlugins.data?.downloads.monthly}
              />
            </div>

            <div>
              <Heading4>Daily</Heading4>
              <CircleIndicatorTemplate
                layoutClassName={styles.downloadIndicatorContainer}
                maxValue={getPlugins.data?.downloads.total}
                value={getPlugins.data?.downloads.daily}
              />
            </div>
          </div>
        </div>
      )}

      {getPlugins.isLoading && <Skeleton height="200px" />}
    </Container>
  );
};

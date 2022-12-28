import * as React from "react";
import * as styles from "./GatewayDetailTemplate.module.css";
import {
  Button,
  Divider,
  Heading1,
  Heading2,
  Heading3,
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
import { ExternalLinkIcon } from "@gemeente-denhaag/icons";
import TableWrapper from "../../components/tableWrapper/TableWrapper";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@gemeente-denhaag/table";

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
          <Button className={styles.buttonIcon} type="submit">
            <FontAwesomeIcon icon={faArrowsRotate} />
            {t(getPlugins.data?.update ? "Upgrade to" : "Upgrade")} {getPlugins.data?.update && getPlugins.data.update}
          </Button>
        </div>
      </section>

      {getPlugins.isError && "Error..."}

      {getPlugins.isSuccess && (
        <div className={styles.gatewayDetailContainer}>
          <div>
            <Heading2>{getPlugins.data?.name}</Heading2>

            <div className={styles.type}>
              {getPlugins.data?.version && (
                <p>{`Installed version: ${
                  getPlugins.data.update ? getPlugins.data?.version : `Latest (${getPlugins.data?.version})`
                } `}</p>
              )}
              <p>{`last update time: ${new Date(getPlugins.data?.time).toLocaleString()}`}</p>
            </div>

            <div>
              <Paragraph>{getPlugins.data?.description}</Paragraph>
            </div>
          </div>

          <div>
            <Heading3>Downloads</Heading3>
            <div className={styles.cardsContainer}>
              <div className={styles.card}>
                <Heading4>Total</Heading4>
                <div className={styles.cardContent}>
                  <Heading3>{getPlugins.data?.downloads?.total}</Heading3>
                </div>
              </div>

              <div className={styles.card}>
                <Heading4>Monthly</Heading4>
                <div className={styles.cardContent}>
                  <Heading3>{getPlugins.data?.downloads?.monthly}</Heading3>
                </div>
              </div>

              <div className={styles.card}>
                <Heading3>Daily</Heading3>
                <div className={styles.cardContent}>
                  <Heading3>{getPlugins.data?.downloads?.daily}</Heading3>
                </div>
              </div>
            </div>
          </div>

          <Divider />

          <div>
            <h3>
              <span onClick={() => open(getPlugins.data.repository)}>
                <Link icon={<ExternalLinkIcon />}>Github</Link>
              </span>
            </h3>
            <div>
              <TableWrapper>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableHeader>Forks</TableHeader>
                      <TableHeader>Stars</TableHeader>
                      <TableHeader>Watchers</TableHeader>
                      <TableHeader>Open issues</TableHeader>
                      <TableHeader>Dependents</TableHeader>
                      <TableHeader>Faves</TableHeader>
                      <TableHeader>Suggesters</TableHeader>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>{getPlugins.data.github_forks}</TableCell>
                      <TableCell>{getPlugins.data.github_stars}</TableCell>
                      <TableCell>{getPlugins.data.github_watchers}</TableCell>
                      <TableCell>{getPlugins.data.github_open_issues}</TableCell>
                      <TableCell>{getPlugins.data.dependents}</TableCell>
                      <TableCell>{getPlugins.data.favers}</TableCell>
                      <TableCell>{getPlugins.data.suggesters}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableWrapper>
            </div>
          </div>
        </div>
      )}

      {getPlugins.isLoading && <Skeleton height="200px" />}
    </Container>
  );
};

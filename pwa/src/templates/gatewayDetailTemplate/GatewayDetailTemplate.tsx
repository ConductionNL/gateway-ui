import * as React from "react";
import * as styles from "./GatewayDetailTemplate.module.css";
import { Button, Heading1, Heading2, Heading3, Paragraph } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { Container } from "@conduction/components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsRotate, faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import _ from "lodash";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@gemeente-denhaag/table";
import { QueryClient } from "react-query";
import { usePlugin } from "../../hooks/plugin";
import Skeleton from "react-loading-skeleton";

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
        <>
          <div className={styles.gatewayDetailContainer}>
            <div>
              <Heading2>{getPlugins.data?.name}</Heading2>

              <div className={styles.type}>
                <p>{`Type: ${getPlugins.data?.type}`}</p>
                <p>{`Language: ${getPlugins.data?.language}`}</p>
              </div>

              <div className={styles.descriptionAndRepo}>
                <Paragraph>{getPlugins.data?.description}</Paragraph>

                <div>
                  {getPlugins.data.repository && (
                    <Button
                      icon={<FontAwesomeIcon icon={faArrowUpRightFromSquare} />}
                      onClick={() => open(getPlugins.data.repository)}
                    >
                      Repository
                    </Button>
                  )}
                </div>
              </div>

              <></>
            </div>
          </div>
        </>
      )}

      {getPlugins.isLoading && <Skeleton height="200px" />}
    </Container>
  );
};

import * as React from "react";
import * as styles from "./GatewayDetailTemplate.module.css";
import { Button, Heading1, Heading2, Heading3, Paragraph } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { Container, Tag, ToolTip } from "@conduction/components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TEMPORARY_GATEWAYDETAIL } from "../../data/gatewayDetail";
import { faArrowsRotate } from "@fortawesome/free-solid-svg-icons";
import _ from "lodash";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@gemeente-denhaag/table";
import { QueryClient } from "react-query";
import { usePlugin } from "../../hooks/plugin";
import Skeleton from "react-loading-skeleton";

export const GatewayDetailTemplate: React.FC = () => {
  const { t, i18n } = useTranslation();

  const queryClient = new QueryClient();
  const _usePlugin = usePlugin(queryClient);
  const getPlugins = _usePlugin.getView();

  const gatewayDetails = TEMPORARY_GATEWAYDETAIL;

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
                <p>{`Names: ${getPlugins.data?.names.join(", ")}`}</p>
                <p>{`Versions: ${getPlugins.data?.versions.join(", ")}`}</p>
              </div>

              <div className={styles.descriptionAndTags}>
                <Paragraph className={styles.description}>{getPlugins.data?.description}</Paragraph>

                <div className={styles.tags}>
                  {getPlugins.data?.licenses &&
                    getPlugins.data.licenses.length > 0 &&
                    getPlugins.data.licenses.map((license: any) => (
                      <ToolTip tooltip={`License ${license?.osi}`}>
                        <Tag label={_.upperFirst(license?.name)} onClick={() => open(license?.url)} />
                      </ToolTip>
                    ))}

                  {getPlugins.data?.source && (
                    <ToolTip tooltip={`Source ${getPlugins.data?.source.reference}`}>
                      <Tag
                        label={_.upperFirst(getPlugins.data?.source.type)}
                        onClick={() => open(getPlugins.data?.source.url)}
                      />
                    </ToolTip>
                  )}

                  {getPlugins.data?.dist && (
                    <ToolTip tooltip={`Dist ${getPlugins.data.dist?.reference}`}>
                      <Tag
                        label={_.upperFirst(getPlugins.data.dist?.type)}
                        onClick={() => open(getPlugins.data.dist?.url)}
                      />
                    </ToolTip>
                  )}
                </div>
              </div>
            </div>

            <div className={styles.extraInfo}>
              <div className={styles.extraInfoTable}>
                <Table>
                  <TableHead>
                    <TableRow>
                      {getPlugins.data?.requires && <TableHeader>requires</TableHeader>}
                      {getPlugins.data?.devRequires && <TableHeader>dev requires</TableHeader>}
                      {getPlugins.data?.autoload && <TableHeader>autoload</TableHeader>}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      {getPlugins.data?.requires && (
                        <TableCell>
                          {Object.entries(getPlugins.data.requires).map(([key, value]) => (
                            <>
                              {key} {value} <br />
                            </>
                          ))}
                        </TableCell>
                      )}
                      {getPlugins.data?.devRequires && (
                        <TableCell>
                          {Object.entries(getPlugins.data.devRequires).map(([key, value]) => (
                            <>
                              {key} {value} <br />
                            </>
                          ))}
                        </TableCell>
                      )}
                      {getPlugins.data?.autoload && (
                        <TableCell>
                          {Object.entries(getPlugins.data.autoload).map(([key, value]) => (
                            <>
							  {/* @ts-ignore */}
                              {key} {Object.keys(value)} <br />
                            </>
                          ))}
                        </TableCell>
                      )}
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
              <div className={styles.extraInfoSupport}>
                <Heading3>Support</Heading3>
                <div>
                  {getPlugins.data.support.source && (
                    <Button onClick={() => open(getPlugins.data.support.source)}>Source</Button>
                  )}
                  {getPlugins.data.support.issues && (
                    <Button onClick={() => open(getPlugins.data.support.issues)}>Issues</Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {getPlugins.isLoading && <Skeleton height="200px" />}
    </Container>
  );
};

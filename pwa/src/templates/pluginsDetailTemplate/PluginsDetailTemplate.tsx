import * as React from "react";
import * as styles from "./PluginsDetailTemplate.module.css";
import { useTranslation } from "react-i18next";
import { Container, Tag, ToolTip } from "@conduction/components";
import { Button, Divider, Heading1, Heading3, Heading4, Link, Paragraph } from "@gemeente-denhaag/components-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsRotate, faDownload, faHome, faScroll, faTrash } from "@fortawesome/free-solid-svg-icons";
import clsx from "clsx";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@gemeente-denhaag/table";
import _ from "lodash";
import { QueryClient } from "react-query";
import { usePlugin } from "../../hooks/plugin";
import Skeleton from "react-loading-skeleton";
import { ExternalLinkIcon } from "@gemeente-denhaag/icons";
import { GitHubLogo } from "../../assets/svgs/GitHub";
import TableWrapper from "../../components/tableWrapper/TableWrapper";

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
                  {!!getPlugin.data.update && (
                    <Button className={styles.buttonIcon} type="submit">
                      <FontAwesomeIcon icon={faArrowsRotate} />
                      {t("Update to")} {getPlugin.data.update}
                    </Button>
                  )}

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
                {getPlugin.data?.version && <p>{`Installed version: ${getPlugin.data?.version}`}</p>}
                <p>{`last update time: ${new Date(getPlugin.data?.time).toLocaleString()}`}</p>
              </div>

              <div className={styles.descriptionAndTags}>
                <Paragraph className={styles.description}>{getPlugin.data?.description}</Paragraph>

                <div className={styles.tags}>
                  {getPlugin.data?.license &&
                    getPlugin.data.license.length > 0 &&
                    getPlugin.data.license.map((_license: any) => (
                      <ToolTip tooltip={`License ${_license}`}>
                        <Tag icon={<FontAwesomeIcon icon={faScroll} />} label={_.upperFirst(_license)} />
                      </ToolTip>
                    ))}

                  {getPlugin.data?.source && (
                    <ToolTip tooltip={`Source`}>
                      <Tag
                        icon={<GitHubLogo />}
                        label={_.upperFirst(getPlugin.data.source?.type)}
                        onClick={() => open(getPlugin.data.source?.url)}
                      />
                    </ToolTip>
                  )}

                  {getPlugin.data?.homepage && (
                    <Tag
                      icon={<FontAwesomeIcon icon={faHome} />}
                      label="homepage"
                      onClick={() => open(getPlugin.data.homepage)}
                    />
                  )}
                </div>
              </div>
            </div>

            {(getPlugin.data?.require || getPlugin.data.support) && (
              <div className={styles.extraInfo}>
                {getPlugin.data?.require && (
                  <div className={styles.extraInfoTable}>
                    <Table>
                      <TableHead>
                        <TableRow>{getPlugin.data?.require && <TableHeader>requires</TableHeader>}</TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          {getPlugin.data?.require && (
                            <TableCell>
                              {Object.entries(getPlugin.data.require).map(([key, value]) => (
                                <>
                                  {key} {value} <br />
                                </>
                              ))}
                            </TableCell>
                          )}
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                )}
                {getPlugin.data.support && (
                  <div className={styles.extraInfoSupport}>
                    <Heading3>Support</Heading3>
                    <div>
                      {getPlugin.data.support?.source && (
                        <Button icon={<ExternalLinkIcon />} onClick={() => open(getPlugin.data.support.source)}>
                          Source
                        </Button>
                      )}
                      {getPlugin.data.support?.issues && (
                        <Button icon={<ExternalLinkIcon />} onClick={() => open(getPlugin.data.support.issues)}>
                          Issues
                        </Button>
                      )}
                      {getPlugin.data.dist && (
                        <Button icon={<ExternalLinkIcon />} onClick={() => open(getPlugin.data.dist.url)}>
                          Download
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            <Divider />

            <div>
              <Heading3>Downloads</Heading3>
              <div className={styles.cardsContainer}>
                <div className={styles.card}>
                  <Heading4>Total</Heading4>
                  <div className={styles.cardContent}>
                    <Heading3>{getPlugin.data?.downloads?.total}</Heading3>
                  </div>
                </div>

                <div className={styles.card}>
                  <Heading4>Monthly</Heading4>
                  <div className={styles.cardContent}>
                    <Heading3>{getPlugin.data?.downloads?.monthly}</Heading3>
                  </div>
                </div>

                <div className={styles.card}>
                  <Heading3>Daily</Heading3>
                  <div className={styles.cardContent}>
                    <Heading3>{getPlugin.data?.downloads?.daily}</Heading3>
                  </div>
                </div>
              </div>
            </div>

            <Divider />

            <div>
              <h3>
                <span onClick={() => open(getPlugin.data.repository)}>
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
                        <TableCell>{getPlugin.data.github_forks}</TableCell>
                        <TableCell>{getPlugin.data.github_stars}</TableCell>
                        <TableCell>{getPlugin.data.github_watchers}</TableCell>
                        <TableCell>{getPlugin.data.github_open_issues}</TableCell>
                        <TableCell>{getPlugin.data.dependents}</TableCell>
                        <TableCell>{getPlugin.data.favers}</TableCell>
                        <TableCell>{getPlugin.data.suggesters}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableWrapper>
              </div>
            </div>

            <Divider />

            <div>
              <Heading3>Maintainers</Heading3>
              <div className={styles.maintainersContainer}>
                {getPlugin.data.maintainers.map((maintainer: any) => (
                  <div className={styles.maintainer}>
                    <img src={maintainer.avatar_url} />
                    <Heading4>{maintainer.name}</Heading4>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Container>
    </>
  );
};

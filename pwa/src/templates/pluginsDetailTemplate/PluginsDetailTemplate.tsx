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
import { VerticalMenu } from "../templateParts/verticalMenu/VerticalMenu";

interface PluginsDetailPageProps {
  pluginName: string;
}

export const PluginsDetailTemplate: React.FC<PluginsDetailPageProps> = ({ pluginName }) => {
  const { t } = useTranslation();
  const [currentRequire, setCurrentRequire] = React.useState<string>("");

  const queryClient = new QueryClient();
  const _usePlugin = usePlugin(queryClient);
  const getPlugin = _usePlugin.getOne(pluginName.replace("_", "/"));
  const deletePlugin = _usePlugin.remove();

  const installed = getPlugin.isSuccess && getPlugin.data.version ? true : false;

  const pluginRepository = getPlugin.isSuccess && getPlugin.data.repository;
  const getReadMe = _usePlugin.getReadMe(pluginRepository);

  const handleDeletePlugin = () => {
    const confirmDeletion = confirm("Are you sure you want to delete this action?");

    if (confirmDeletion) {
      deletePlugin.mutate({ name: pluginName.replace("_", "/") });
    }
  };

  const handleDownloadButton = (data: string) => {
    const confirmDeletion = confirm(
      t(
        "This file comes from a 3rd party and can potentially be harmfull for your PC. Are you sure you want to download this?",
      ),
    );

    if (confirmDeletion) {
      open(data);
    }
  };

  const versionsSideBar =
    getPlugin.isSuccess &&
    Object.values(getPlugin.data.versions).map((data: any) => ({
      label: data.version,
      current: data.version === currentRequire,
      onClick: () => setCurrentRequire(data.version),
    }));

  React.useEffect(() => {
    if (!getPlugin.data) return;

    if (!getPlugin.data.version) {
      versionsSideBar &&
        versionsSideBar.map((version: any) => {
          version.label.includes("main" || "master") && setCurrentRequire(version.label);
        });
    }

    getPlugin.data.version && setCurrentRequire(getPlugin.data.version);
  }, [getPlugin.isSuccess]);

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
                      {t("Upgrade to")} {getPlugin.data.update}
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
                {getPlugin.data?.version && (
                  <p>{`Installed version: ${
                    getPlugin.data.update ? getPlugin.data?.version : `Latest (${getPlugin.data?.version})`
                  } `}</p>
                )}
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
                    <Button icon={<ExternalLinkIcon />} onClick={() => handleDownloadButton(getPlugin.data.dist.url)}>
                      Download
                    </Button>
                  )}
                </div>
              </div>
            )}
            <div className={styles.requiredTableContainer}>
              <div className={styles.mainSections}>
                <div className={styles.extraInfoTable}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableHeader className={styles.requiredTableHeader}>
                          <span>{currentRequire}</span>
                          <span>
                            {currentRequire && new Date(getPlugin.data.versions[currentRequire].time).toLocaleString()}
                          </span>
                        </TableHeader>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>
                          requires: <br />
                          <ul>
                            {currentRequire &&
                              Object.entries(getPlugin.data.versions[currentRequire].require).map(([key, value]) => (
                                <>
                                  <li>
                                    {key}: {value}
                                  </li>
                                </>
                              ))}
                          </ul>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
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
              <div className={styles.requiredSideNavContainer}>
                {/* @ts-ignore */}
                <VerticalMenu layoutClassName={styles.requiredSideNav} items={versionsSideBar} />
              </div>
            </div>
            <Divider />
            <Heading3>README</Heading3>
            {getReadMe.isLoading && <Skeleton height="200px" />}
            <div>
              {getReadMe.data ? (
                <div dangerouslySetInnerHTML={{ __html: getReadMe.data }} />
              ) : (
                <p>This plugin has no README</p>
              )}
            </div>
          </div>
        )}
      </Container>
    </>
  );
};

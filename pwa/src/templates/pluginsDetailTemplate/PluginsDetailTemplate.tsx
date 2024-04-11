import * as React from "react";
import * as styles from "./PluginsDetailTemplate.module.css";
import { useTranslation } from "react-i18next";
import { Container, Tag } from "@conduction/components";
import { Divider, Heading1, Heading3, Paragraph } from "@gemeente-denhaag/components-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowsRotate,
  faChevronDown,
  faChevronUp,
  faDownload,
  faExternalLink,
  faHome,
  faScroll,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@gemeente-denhaag/table";
import _ from "lodash";
import { useQueryClient } from "react-query";
import { usePlugin } from "../../hooks/plugin";
import Skeleton from "react-loading-skeleton";
import { GitHubLogo } from "../../assets/svgs/GitHub";
import { VerticalMenu } from "../templateParts/verticalMenu/VerticalMenu";
import { Button } from "../../components/button/Button";
import { TOOLTIP_ID } from "../../layout/Layout";

interface PluginsDetailPageProps {
  pluginName: string;
}

export const PluginsDetailTemplate: React.FC<PluginsDetailPageProps> = ({ pluginName }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [currentRequire, setCurrentRequire] = React.useState<string>("");
  const [showmoreVersions, setShowmoreVersions] = React.useState<boolean>(false);

  const queryClient = useQueryClient();
  const _usePlugin = usePlugin(queryClient);
  const getPlugin = _usePlugin.getOne(pluginName.replace("_", "/"));
  const installPlugin = _usePlugin.install();
  const upgradePlugin = _usePlugin.upgrade();
  const deletePlugin = _usePlugin.remove();

  const installed = getPlugin.isSuccess && getPlugin.data.version ? true : false;

  const pluginRepository = getPlugin.isSuccess && getPlugin.data.repository;
  const getReadMe = _usePlugin.getReadMe(pluginRepository);

  const handleInstallPlugin = () => {
    installPlugin.mutate({ name: getPlugin.data.name });
  };

  const handleUpgradePlugin = () => {
    upgradePlugin.mutate({ name: getPlugin.data.name });
  };

  const handleDownloadButton = (data: string) => {
    const confirmDeletion = confirm(
      t(
        "This file comes from a 3rd party and can potentially be harmful for your PC. Are you sure you want to download this?",
      ),
    );

    if (confirmDeletion) {
      open(data);
    }
  };

  const versionsSideBar =
    getPlugin.isSuccess && getPlugin.data.versions
      ? Object.values(getPlugin.data.versions).map((data: any) => ({
          label: data.version,
          current: data.version === currentRequire,
          onClick: () => setCurrentRequire(data.version),
        }))
      : [];

  React.useEffect(() => {
    setLoading(installPlugin.isLoading || upgradePlugin.isLoading || deletePlugin.isLoading);
  }, [installPlugin.isLoading, upgradePlugin.isLoading, deletePlugin.isLoading]);

  React.useEffect(() => {
    if (!getPlugin.data) return;

    const versionExists: boolean = getPlugin.data.version
      ? !!versionsSideBar.filter((version) => version.label === getPlugin.data.version).length
      : false;

    if (!versionExists) {
      versionsSideBar &&
        versionsSideBar.map((version: any) => {
          version.label.includes("main" || "master") && setCurrentRequire(version.label);
        });
    }

    versionExists && setCurrentRequire(getPlugin.data.version);
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
                    <Button
                      variant="primary"
                      label={`${t("Upgrade to")} ${getPlugin.data.update}`}
                      icon={faArrowsRotate}
                      disabled={loading}
                      onClick={handleUpgradePlugin}
                      type="submit"
                    />
                  )}

                  <Button
                    variant="danger"
                    icon={faTrash}
                    label={t("Remove")}
                    disabled={loading}
                    onClick={() => deletePlugin.mutate({ name: getPlugin.data.name })}
                  />
                </div>
              )}
              {!installed && (
                <div className={styles.buttons}>
                  <Button
                    variant="primary"
                    label={t("Install")}
                    icon={faDownload}
                    disabled={loading}
                    onClick={handleInstallPlugin}
                  />
                </div>
              )}
            </section>

            <div>
              <div className={styles.typeAndTags}>
                <div className={styles.type}>
                  {getPlugin.data?.version && (
                    <p>{`Installed version: ${
                      getPlugin.data.update ? getPlugin.data?.version : `Latest (${getPlugin.data?.version})`
                    } `}</p>
                  )}
                  <p>{`last update time: ${new Date(getPlugin.data?.time).toLocaleString()}`}</p>
                </div>

                <div className={styles.tags}>
                  {getPlugin.data?.license &&
                    getPlugin.data.license.length > 0 &&
                    getPlugin.data.license.map((_license: any, idx: number) => (
                      <span data-tooltip-id={TOOLTIP_ID} data-tooltip-content={`License ${_license}`} key={idx}>
                        <Tag icon={<FontAwesomeIcon icon={faScroll} />} label={_.upperFirst(_license)} />
                      </span>
                    ))}

                  {getPlugin.data?.source && (
                    <span data-tooltip-id={TOOLTIP_ID} data-tooltip-content={"Source"}>
                      <Tag
                        icon={<GitHubLogo />}
                        label={_.upperFirst(getPlugin.data.source?.type)}
                        onClick={() => open(getPlugin.data.source?.url)}
                      />
                    </span>
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

              <div>
                <Paragraph>{getPlugin.data?.description}</Paragraph>
              </div>
            </div>

            <div className={styles.sectionContainer}>
              <div className={styles.mainSection}>
                <div className={styles.requiredTable}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableHeader className={styles.requiredTableHeader}>
                          <span>{currentRequire}</span>
                          <span>
                            {currentRequire && new Date(getPlugin.data.versions[currentRequire]?.time).toLocaleString()}
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
                              Object.entries(getPlugin.data.versions[currentRequire]?.require).map(
                                ([key, value]: any, idx) => (
                                  <li key={idx}>
                                    {key}: {value}
                                  </li>
                                ),
                              )}
                          </ul>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
                <div>
                  <Heading3>README</Heading3>
                  {getReadMe.isLoading && <Skeleton height="200px" />}
                  <div>
                    {getReadMe.data ? (
                      <div className={styles.readme} dangerouslySetInnerHTML={{ __html: getReadMe.data }} />
                    ) : (
                      <p>This plugin has no README</p>
                    )}
                  </div>
                </div>
              </div>

              <div className={styles.sideBarSection}>
                <Heading3>Versions</Heading3>
                <VerticalMenu
                  layoutClassName={styles.requiredSideNav}
                  items={showmoreVersions ? versionsSideBar : versionsSideBar.slice(0, 6)}
                />
                {versionsSideBar.length > 6 && (
                  <div
                    className={styles.showmoreVersionsButton}
                    onClick={() => setShowmoreVersions((showmoreVersions) => !showmoreVersions)}
                  >
                    {showmoreVersions ? (
                      <FontAwesomeIcon icon={faChevronUp} />
                    ) : (
                      <FontAwesomeIcon icon={faChevronDown} />
                    )}
                  </div>
                )}

                <Divider />

                {getPlugin.data.support && (
                  <>
                    <div className={styles.extraInfoSupport}>
                      <Heading3>Support</Heading3>
                      <div>
                        {getPlugin.data.support?.source && (
                          <Button
                            variant="primary"
                            label="Source"
                            icon={faExternalLink}
                            onClick={() => open(getPlugin.data.support.source)}
                          />
                        )}
                        {getPlugin.data.support?.issues && (
                          <Button
                            variant="primary"
                            label="Issues"
                            icon={faExternalLink}
                            onClick={() => open(getPlugin.data.support.issues)}
                          />
                        )}
                        {getPlugin.data.dist && (
                          <Button
                            variant="primary"
                            label="Download"
                            icon={faExternalLink}
                            onClick={() => handleDownloadButton(getPlugin.data.dist.url)}
                          />
                        )}
                      </div>
                    </div>

                    <Divider />
                  </>
                )}

                <div className={styles.sideBarTitle}>
                  <Heading3>Downloads</Heading3>
                  <div className={styles.downloadsContent}>
                    <div>
                      <span>Total</span>
                      <div>
                        <span>{getPlugin.data?.downloads?.total}</span>
                      </div>
                    </div>

                    <div>
                      <span>Monthly</span>
                      <div>
                        <span>{getPlugin.data?.downloads?.monthly}</span>
                      </div>
                    </div>

                    <div>
                      <span>Daily</span>
                      <div>
                        <span>{getPlugin.data?.downloads?.daily}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <Divider />

                <div className={styles.sideBarTitle}>
                  <Heading3>Github</Heading3>
                  <div>Forks: {getPlugin.data.github_forks}</div>
                  <div>Stars: {getPlugin.data.github_stars}</div>
                  <div>Watchers: {getPlugin.data.github_watchers}</div>
                  <div>Open issues: {getPlugin.data.github_open_issues}</div>
                  <div>Dependents: {getPlugin.data.dependents}</div>
                  <div>Favers: {getPlugin.data.favers}</div>
                  <div>Suggesters: {getPlugin.data.suggesters}</div>
                </div>

                <Divider />

                {getPlugin.data.maintainers && (
                  <>
                    <div className={styles.sideBarTitle}>
                      <Heading3>Maintainers</Heading3>
                      <div className={styles.maintainersContainer}>
                        {getPlugin.data.maintainers.map((maintainer: any, idx: number) => (
                          <span data-tooltip-id={TOOLTIP_ID} data-tooltip-content={maintainer.name} key={idx}>
                            <div className={styles.maintainer}>
                              <img src={maintainer.avatar_url} />
                            </div>
                          </span>
                        ))}
                      </div>
                    </div>

                    <Divider />
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </Container>
    </>
  );
};

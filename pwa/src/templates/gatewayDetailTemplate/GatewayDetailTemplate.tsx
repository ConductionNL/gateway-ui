import * as React from "react";
import * as styles from "./GatewayDetailTemplate.module.css";
import { Button, Divider, Heading3, Paragraph } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { Container } from "@conduction/components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsRotate, faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import _ from "lodash";
import { QueryClient } from "react-query";
import { usePlugin } from "../../hooks/plugin";
import Skeleton from "react-loading-skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@gemeente-denhaag/table";
import { VerticalMenu } from "../templateParts/verticalMenu/VerticalMenu";

export const GatewayDetailTemplate: React.FC = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [currentRequire, setCurrentRequire] = React.useState<string>("");
  const [showmoreVersions, setShowmoreVersions] = React.useState<boolean>(false);

  const queryClient = new QueryClient();
  const _usePlugin = usePlugin(queryClient);
  const getPlugins = _usePlugin.getView();
  const upgradePlugin = _usePlugin.upgrade();

  const pluginRepository = getPlugins.isSuccess && getPlugins.data.repository;
  const getReadMe = _usePlugin.getReadMe(pluginRepository);

  const handleUpgradePlugin = () => {
    upgradePlugin.mutate({ name: getPlugins.data.name });
  };

  const versionsSideBar = getPlugins.isSuccess
    ? Object.values(getPlugins.data.versions).map((data: any) => ({
        label: data.version,
        current: data.version === currentRequire,
        onClick: () => setCurrentRequire(data.version),
      }))
    : [];

  React.useEffect(() => {
    setLoading(upgradePlugin.isLoading);
  }, [upgradePlugin.isLoading]);

  React.useEffect(() => {
    if (!getPlugins.data) return;

    if (!getPlugins.data.version) {
      versionsSideBar &&
        versionsSideBar.map((version: any) => {
          version.label.includes("main" || "master") && setCurrentRequire(version.label);
        });
    }

    getPlugins.data.version && setCurrentRequire(getPlugins.data.version);
  }, [getPlugins.isSuccess]);

  return (
    <Container layoutClassName={styles.container}>
      {getPlugins.isError && "Error..."}

      {getPlugins.isSuccess && (
        <div className={styles.gatewayDetailContainer}>
          <section className={styles.section}>
            <div>
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

            <div className={styles.buttons}>
              <Button onClick={handleUpgradePlugin} className={styles.buttonIcon} type="submit" disabled={loading}>
                <FontAwesomeIcon icon={faArrowsRotate} />
                {t(getPlugins.data?.update ? "Upgrade to" : "Upgrade")}{" "}
                {getPlugins.data?.update && getPlugins.data.update}
              </Button>
            </div>
          </section>

          <div className={styles.sectionContainer}>
            <div className={styles.mainSection}>
              <div className={styles.requiredTable}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableHeader className={styles.requiredTableHeader}>
                        <span>{currentRequire}</span>
                        <span>
                          {/* {currentRequire && new Date(getPlugins.data.versions[currentRequire].time).toLocaleString()} */}
                        </span>
                      </TableHeader>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        requires: <br />
                        <ul>
                          {/* {currentRequire &&
                            Object.entries(getPlugins.data.versions[currentRequire].require).map(([key, value]) => (
                              <>
                                <li>
                                  {key}: {value}
                                </li>
                              </>
                            ))} */}
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
                    <div dangerouslySetInnerHTML={{ __html: getReadMe.data }} />
                  ) : (
                    <p>This plugin has no README</p>
                  )}
                </div>
              </div>
            </div>

            <div className={styles.sideBarSection}>
              <VerticalMenu
                layoutClassName={styles.requiredSideNav}
                items={showmoreVersions ? versionsSideBar : versionsSideBar.slice(0, 6)}
              />
              {versionsSideBar.length > 6 && (
                <div
                  className={styles.showmoreVersionsButton}
                  onClick={() => setShowmoreVersions((showmoreVersions) => !showmoreVersions)}
                >
                  {showmoreVersions ? <FontAwesomeIcon icon={faChevronUp} /> : <FontAwesomeIcon icon={faChevronDown} />}
                </div>
              )}

              <Divider />
            </div>
          </div>
        </div>
      )}

      {getPlugins.isLoading && <Skeleton height="200px" />}
    </Container>
  );
};

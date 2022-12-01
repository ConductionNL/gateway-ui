import * as React from "react";
import * as styles from "./PluginsDetailTemplate.module.css";
import { useTranslation } from "react-i18next";
import { Container, Tag, ToolTip } from "@conduction/components";
import { Button, Heading1, Heading3, LeadParagraph } from "@gemeente-denhaag/components-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsRotate, faDownload, faTrash } from "@fortawesome/free-solid-svg-icons";
import clsx from "clsx";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@gemeente-denhaag/table";
import _ from "lodash";
import { QueryClient } from "react-query";
import { usePlugin } from "../../hooks/plugin";
import Skeleton from "react-loading-skeleton";

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
  const installPlugin = _usePlugin.install();

  const handleDeletePlugin = () => {
    const confirmDeletion = confirm("Are you sure you want to delete this action?");

    if (confirmDeletion) {
      deletePlugin.mutate({ name: pluginName.replace("_", "/") });
    }
  };

  const handleInstallPlugin = () => {
    const payload = { name: pluginName.replace("_", "/") };

    installPlugin.mutate(payload);
  };

  return (
    <>
      <Container layoutClassName={styles.container}>
        {getPlugin.isLoading && <Skeleton height="200px" />}
        {getPlugin.isError && "Error..."}
        {getPlugin.isSuccess && (
          <div className={styles.gatewayDetailContainer}>
            <div>
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
                    <Button onClick={handleInstallPlugin} className={styles.buttonIcon}>
                      <FontAwesomeIcon icon={faDownload} />
                      {t("Install")}
                    </Button>
                  </div>
                )}
              </section>

              <div className={styles.type}>
                <p>{`Type: ${getPlugin.data.type}`}</p>
                <p>{`Names: ${getPlugin.data.names.join(", ")}`}</p>
                <p>{`Versions: ${getPlugin.data.versions.join(", ")}`}</p>
              </div>

              <div className={styles.descriptionAndTags}>
                <LeadParagraph className={styles.description}>{getPlugin.data.description}</LeadParagraph>

                <div className={styles.tags}>
                  {getPlugin.data?.licenses &&
                    getPlugin.data.licenses.length > 0 &&
                    getPlugin.data.licenses.map((license: any) => (
                      <ToolTip tooltip={`License ${license?.osi}`}>
                        <Tag label={_.upperFirst(license?.name)} onClick={() => open(license?.url)} />
                      </ToolTip>
                    ))}

                  {getPlugin.data?.source && (
                    <ToolTip tooltip={`Source ${getPlugin.data.source?.reference}`}>
                      <Tag
                        label={_.upperFirst(getPlugin.data.source?.type)}
                        onClick={() => open(getPlugin.data.source?.url)}
                      />
                    </ToolTip>
                  )}

                  {getPlugin.data?.dist && (
                    <ToolTip tooltip={`Dist ${getPlugin.data.dist?.reference}`}>
                      <Tag
                        label={_.upperFirst(getPlugin.data.dist?.type)}
                        onClick={() => open(getPlugin.data.dist?.url)}
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
                      {getPlugin.data?.requires && <TableHeader>requires</TableHeader>}
                      {getPlugin.data?.devRequires && <TableHeader>dev requires</TableHeader>}
                      {getPlugin.data?.autoload && <TableHeader>autoload</TableHeader>}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      {getPlugin.data?.requires && (
                        <TableCell>
                          {Object.entries(getPlugin.data.requires).map(([key, value]) => (
                            <>
                              {key} {value} <br />
                            </>
                          ))}
                        </TableCell>
                      )}
                      {getPlugin.data?.devRequires && (
                        <TableCell>
                          {Object.entries(getPlugin.data.devRequires).map(([key, value]) => (
                            <>
                              {key} {value} <br />
                            </>
                          ))}
                        </TableCell>
                      )}
                      {getPlugin.data?.autoload && (
                        <TableCell>
                          {Object.entries(getPlugin.data.autoload).map(([key, value]) => (
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
                  {getPlugin.data.support.source && (
                    <Button onClick={() => open(getPlugin.data.support.source)}>Source</Button>
                  )}
                  {getPlugin.data.support.issues && (
                    <Button onClick={() => open(getPlugin.data.support.issues)}>Issues</Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </Container>
    </>
  );
};

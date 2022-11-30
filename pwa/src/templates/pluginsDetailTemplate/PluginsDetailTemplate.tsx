import * as React from "react";
import * as styles from "./PluginsDetailTemplate.module.css";
import { useTranslation } from "react-i18next";
import { Container, Tag, ToolTip } from "@conduction/components";
import { Button, Heading1, Heading3, LeadParagraph } from "@gemeente-denhaag/components-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsRotate, faDownload, faTrash } from "@fortawesome/free-solid-svg-icons";
import clsx from "clsx";
import { TEMPORARYDETAIL_PLUGINS } from "../../data/pluginDetail";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@gemeente-denhaag/table";
import _ from "lodash";

interface PluginsDetailPageProps {
  pluginId: string;
}

export const PluginsDetailTemplate: React.FC<PluginsDetailPageProps> = ({ pluginId }) => {
  const { t } = useTranslation();

  const tempPlugin = TEMPORARYDETAIL_PLUGINS.find((plugin: any) => {
    return plugin.id === pluginId;
  });

  return (
    <>
      <Container layoutClassName={styles.container}>
        {!tempPlugin && "Error..."}
        {tempPlugin && (
          <div className={styles.gatewayDetailContainer}>
            <div>
              <section className={styles.section}>
                <Heading1 className={styles.title}>{tempPlugin.name}</Heading1>

                {tempPlugin.installed && (
                  <div className={styles.buttons}>
                    <Button className={styles.buttonIcon} type="submit">
                      <FontAwesomeIcon icon={faArrowsRotate} />
                      {t("Update")}
                    </Button>

                    <Button className={clsx(styles.buttonIcon, styles.deleteButton)}>
                      <FontAwesomeIcon icon={faTrash} />
                      {t("Remove")}
                    </Button>
                  </div>
                )}
                {!tempPlugin.installed && (
                  <div className={styles.buttons}>
                    <Button className={styles.buttonIcon}>
                      <FontAwesomeIcon icon={faDownload} />
                      {t("Install")}
                    </Button>
                  </div>
                )}
              </section>

              <div className={styles.type}>
                <p>{`Type: ${tempPlugin.type}`}</p>
                <p>{`Names: ${tempPlugin.names.join(", ")}`}</p>
                <p>{`Versions: ${tempPlugin.versions.join(", ")}`}</p>
              </div>

              <div className={styles.descriptionAndTags}>
                <LeadParagraph className={styles.description}>{tempPlugin.description}</LeadParagraph>

                <div className={styles.tags}>
                  {tempPlugin?.licenses &&
                    tempPlugin.licenses.length > 0 &&
                    tempPlugin.licenses.map((license) => (
                      <ToolTip tooltip={`License ${license?.osi}`}>
                        <Tag label={_.upperFirst(license?.name)} onClick={() => open(license?.url)} />
                      </ToolTip>
                    ))}

                  {tempPlugin?.source && (
                    <ToolTip tooltip={`Source ${tempPlugin.source?.reference}`}>
                      <Tag label={_.upperFirst(tempPlugin.source?.type)} onClick={() => open(tempPlugin.source?.url)} />
                    </ToolTip>
                  )}

                  {tempPlugin?.dist && (
                    <ToolTip tooltip={`Dist ${tempPlugin.dist?.reference}`}>
                      <Tag label={_.upperFirst(tempPlugin.dist?.type)} onClick={() => open(tempPlugin.dist?.url)} />
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
                      {tempPlugin?.requires && <TableHeader>requires</TableHeader>}
                      {tempPlugin?.devRequires && <TableHeader>dev requires</TableHeader>}
                      {tempPlugin?.autoload && <TableHeader>autoload</TableHeader>}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      {tempPlugin?.requires && (
                        <TableCell>
                          {Object.entries(tempPlugin.requires).map(([key, value]) => (
                            <>
                              {key} {value} <br />
                            </>
                          ))}
                        </TableCell>
                      )}
                      {tempPlugin?.devRequires && (
                        <TableCell>
                          {Object.entries(tempPlugin.devRequires).map(([key, value]) => (
                            <>
                              {key} {value} <br />
                            </>
                          ))}
                        </TableCell>
                      )}
                      {tempPlugin?.autoload && (
                        <TableCell>
                          {Object.entries(tempPlugin.autoload).map(([key, value]) => (
                            <>
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
                  {tempPlugin.support.source && <Button onClick={() => open(tempPlugin.support.source)}>Source</Button>}
                  {tempPlugin.support.issues && <Button onClick={() => open(tempPlugin.support.issues)}>Issues</Button>}
                </div>
              </div>
            </div>
          </div>
        )}
      </Container>
    </>
  );
};

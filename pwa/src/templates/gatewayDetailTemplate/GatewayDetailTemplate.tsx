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

export const GatewayDetailTemplate: React.FC = () => {
  const { t, i18n } = useTranslation();

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

      {/* {getUserGroups.isError && "Error..."} */}

      {/* {getUserGroups.isSuccess && ( */}
      {gatewayDetails.map((gatewayDetail) => (
        <div className={styles.gatewayDetailContainer}>
          <div>
            <Heading2>{gatewayDetail.name}</Heading2>

            <div className={styles.type}>
              <p>{`Type: ${gatewayDetail.type}`}</p>
              <p>{`Names: ${gatewayDetail.names.join(", ")}`}</p>
              <p>{`Versions: ${gatewayDetail.versions.join(", ")}`}</p>
            </div>

            <div className={styles.descriptionAndTags}>
              <Paragraph className={styles.description}>{gatewayDetail.description}</Paragraph>

              <div className={styles.tags}>
                {gatewayDetail?.licenses &&
                  gatewayDetail.licenses.length > 0 &&
                  gatewayDetail.licenses.map((license) => (
                    <ToolTip tooltip={`License ${license?.osi}`}>
                      <Tag label={_.upperFirst(license?.name)} onClick={() => open(license?.url)} />
                    </ToolTip>
                  ))}

                {gatewayDetail?.source && (
                  <ToolTip tooltip={`Source ${gatewayDetail.source?.reference}`}>
                    <Tag
                      label={_.upperFirst(gatewayDetail.source?.type)}
                      onClick={() => open(gatewayDetail.source?.url)}
                    />
                  </ToolTip>
                )}

                {gatewayDetail?.dist && (
                  <ToolTip tooltip={`Dist ${gatewayDetail.dist?.reference}`}>
                    <Tag label={_.upperFirst(gatewayDetail.dist?.type)} onClick={() => open(gatewayDetail.dist?.url)} />
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
                    {gatewayDetail?.requires && <TableHeader>requires</TableHeader>}
                    {gatewayDetail?.devRequires && <TableHeader>dev requires</TableHeader>}
                    {gatewayDetail?.autoload && <TableHeader>autoload</TableHeader>}
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    {gatewayDetail?.requires && (
                      <TableCell>
                        {Object.entries(gatewayDetail.requires).map(([key, value]) => (
                          <>
                            {key} {value} <br />
                          </>
                        ))}
                      </TableCell>
                    )}
                    {gatewayDetail?.devRequires && (
                      <TableCell>
                        {Object.entries(gatewayDetail.devRequires).map(([key, value]) => (
                          <>
                            {key} {value} <br />
                          </>
                        ))}
                      </TableCell>
                    )}
                    {gatewayDetail?.autoload && (
                      <TableCell>
                        {Object.entries(gatewayDetail.autoload).map(([key, value]) => (
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
                {gatewayDetail.support.source && (
                  <Button onClick={() => open(gatewayDetail.support.source)}>Source</Button>
                )}
                {gatewayDetail.support.issues && (
                  <Button onClick={() => open(gatewayDetail.support.issues)}>Issues</Button>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
      {/* )} */}

      {/* {getUserGroups.isLoading && <Skeleton height="200px" />} */}
    </Container>
  );
};

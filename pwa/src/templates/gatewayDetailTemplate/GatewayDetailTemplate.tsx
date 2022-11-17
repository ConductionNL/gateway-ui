import * as React from "react";
import * as styles from "./GatewayDetailTemplate.module.css";
import { Button, Heading1, Heading2, Link, Paragraph } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@gemeente-denhaag/table";
import { navigate } from "gatsby";
import { Container, Tag, ToolTip } from "@conduction/components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TEMPORARY_GATEWAYDETAIL } from "../../data/gatewayDetail";
import { faChevronUp } from "@fortawesome/free-solid-svg-icons";
import _ from "lodash";

export const GatewayDetailTemplate: React.FC = () => {
  const { t, i18n } = useTranslation();

  //   const queryClient = new QueryClient();
  //   const _useUserGroup = useUserGroup(queryClient);
  //   const getUserGroups = _useUserGroup.getAll();

  const gatewayDetails = TEMPORARY_GATEWAYDETAIL;

  return (
    <Container layoutClassName={styles.container}>
      <section className={styles.section}>
        <Heading1>{t("Gateway Detail")}</Heading1>
        <div className={styles.buttons}>
          <Button className={styles.buttonIcon}>
            <FontAwesomeIcon icon={faChevronUp} />
            {t("Upgrade")}
          </Button>
        </div>
      </section>

      {/* {getUserGroups.isError && "Error..."} */}

      {/* {getUserGroups.isSuccess && ( */}
      {/* <Table>
        <TableHead>
          <TableRow>
            <TableHeader>{t("Name")}</TableHeader>
            <TableHeader>{t("Description")}</TableHeader>
            <TableHeader>{t("Versions")}</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {gatewayDetails.map((gatewayDetail) => (
            <TableRow className={styles.tableRow} key={gatewayDetail.name}>
              <TableCell>{gatewayDetail.name}</TableCell>
              <TableCell>{gatewayDetail.description ?? "-"}</TableCell>
              <TableCell>{gatewayDetail.versions.join(", ") ?? "-"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table> */}

      {gatewayDetails.map((gatewayDetail) => (
        <>
          <Heading2>{gatewayDetail.name}</Heading2>

          <div className={styles.type}>
            <p>{`Type: ${gatewayDetail.type}`}</p>
            <p>{`Names: ${gatewayDetail.names.join(", ")}`}</p>
          </div>

          <div className={styles.descriptionAndTags}>
            <Paragraph>{gatewayDetail.description}</Paragraph>

            <div className={styles.tags}>
              {gatewayDetail?.licenses &&
                gatewayDetail.licenses.length > 0 &&
                gatewayDetail.licenses.map((license) => (
                  <ToolTip tooltip={`License ${license?.osi}`}>
                    <Tag label={_.upperFirst(license?.name)} onClick={() => open(license?.url)} />
                  </ToolTip>
                ))}
            </div>
          </div>
        </>
      ))}
      {/* )} */}

      {/* {getUserGroups.isLoading && <Skeleton height="200px" />} */}
    </Container>
  );
};

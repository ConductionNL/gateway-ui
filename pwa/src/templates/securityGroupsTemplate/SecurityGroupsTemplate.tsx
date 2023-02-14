import * as React from "react";
import * as styles from "./SecurityGroupsTemplate.module.css";
import { Button, Heading1, Link } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@gemeente-denhaag/table";
import { navigate } from "gatsby";
import { Container } from "@conduction/components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useSecurityGroup } from "../../hooks/securityGroup";
import { useQueryClient } from "react-query";
import Skeleton from "react-loading-skeleton";

export const SecurityGroupsTemplate: React.FC = () => {
  const { t } = useTranslation();

  const queryClient = useQueryClient();
  const _useSecurityGroups = useSecurityGroup(queryClient);
  const getSecurityGroups = _useSecurityGroups.getAll();

  return (
    <Container layoutClassName={styles.container}>
      <section className={styles.section}>
        <Heading1>{t("Security groups")}</Heading1>
        <div className={styles.buttons}>
          <Button className={styles.buttonIcon} onClick={() => navigate(`/settings/securitygroups/new`)}>
            <FontAwesomeIcon icon={faPlus} />
            {t("Add Security group")}
          </Button>
        </div>
      </section>

      {getSecurityGroups.isSuccess && (
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>{t("Name")}</TableHeader>
              <TableHeader>{t("Description")}</TableHeader>
              <TableHeader>{t("Config")}</TableHeader>
              <TableHeader></TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {getSecurityGroups.data.map((securityGroup) => (
              <TableRow
                className={styles.tableRow}
                onClick={() => navigate(`/settings/securitygroups/${securityGroup.id}`)}
                key={securityGroup.id}
              >
                <TableCell>{securityGroup.name}</TableCell>
                <TableCell>{securityGroup.description ?? "-"}</TableCell>
                <TableCell>{securityGroup.config ?? "-"}</TableCell>
                <TableCell onClick={() => navigate(`/settings/securitygroups/${securityGroup.id}`)}>
                  <Link icon={<FontAwesomeIcon icon={faArrowRight} />} iconAlign="start">
                    {t("Details")}
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      {getSecurityGroups.isLoading && <Skeleton height={"200px"} />}
    </Container>
  );
};

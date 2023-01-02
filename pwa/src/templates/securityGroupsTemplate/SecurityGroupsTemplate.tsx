import * as React from "react";
import * as styles from "./SecurityGroupsTemplate.module.css";
import { Button, Heading1, Link } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@gemeente-denhaag/table";
import { navigate } from "gatsby";
import { Container } from "@conduction/components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { ArrowRightIcon } from "@gemeente-denhaag/icons";
import { TEMPORARY_USERGROUPS } from "../../data/userGroup";

export const SecurityGroupsTemplate: React.FC = () => {
  const { t, i18n } = useTranslation();

  const userGroups = TEMPORARY_USERGROUPS;

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
          {userGroups.map((userGroup) => (
            <TableRow
              className={styles.tableRow}
              onClick={() => navigate(`/settings/securitygroups/${userGroup.id}`)}
              key={userGroup.id}
            >
              <TableCell>{userGroup.name}</TableCell>
              <TableCell>{userGroup.description ?? "-"}</TableCell>
              <TableCell>{userGroup.config ?? "-"}</TableCell>
              <TableCell onClick={() => navigate(`/settings/securitygroups/${userGroup.id}`)}>
                <Link icon={<ArrowRightIcon />} iconAlign="start">
                  {t("Details")}
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
};

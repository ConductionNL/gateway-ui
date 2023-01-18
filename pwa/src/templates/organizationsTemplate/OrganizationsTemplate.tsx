import * as React from "react";
import * as styles from "./OrganizationsTemplate.module.css";
import { Button, Heading1, Link } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@gemeente-denhaag/table";
import { navigate } from "gatsby";
import { Container } from "@conduction/components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { ArrowRightIcon } from "@gemeente-denhaag/icons";
import { QueryClient } from "react-query";
import { useOrganization } from "../../hooks/organization";
import { translateDate } from "../../services/dateFormat";
import Skeleton from "react-loading-skeleton";

export const OrganizationsTemplate: React.FC = () => {
  const { t, i18n } = useTranslation();

  const queryClient = new QueryClient();
  const _useOrganizations = useOrganization(queryClient);
  const getOrganizations = _useOrganizations.getAll();

  return (
    <Container layoutClassName={styles.container}>
      <section className={styles.section}>
        <Heading1>{t("Organizations groups")}</Heading1>
        <div className={styles.buttons}>
          <Button className={styles.buttonIcon} onClick={() => navigate(`/settings/organizations/new`)}>
            <FontAwesomeIcon icon={faPlus} />
            {t("Add Organization")}
          </Button>
        </div>
      </section>

      {getOrganizations.isSuccess && (
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>{t("Name")}</TableHeader>
              <TableHeader>{t("Number of users")}</TableHeader>
              <TableHeader>{t("Date created")}</TableHeader>
              <TableHeader>{t("Date modified")}</TableHeader>
              <TableHeader></TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {getOrganizations.data.map((organization) => (
              <TableRow
                className={styles.tableRow}
                onClick={() => navigate(`/settings/organizations/${organization.id}`)}
                key={organization.id}
              >
                <TableCell>{organization.name}</TableCell>
                <TableCell>{organization.users.length ?? "-"}</TableCell>
                <TableCell>{translateDate(i18n.language, organization.dateCreated) ?? "-"}</TableCell>
                <TableCell>{translateDate(i18n.language, organization.dateModified) ?? "-"}</TableCell>
                <TableCell onClick={() => navigate(`/settings/organizations/${organization.id}`)}>
                  <Link icon={<ArrowRightIcon />} iconAlign="start">
                    {t("Details")}
                  </Link>
                </TableCell>
              </TableRow>
            ))}
            {!getOrganizations.data.length && (
              <TableRow>
                <TableCell>No organizations found</TableCell>
                <TableCell />
                <TableCell />
                <TableCell />
                <TableCell />
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}

      {getOrganizations.isLoading && <Skeleton height={200} />}
    </Container>
  );
};

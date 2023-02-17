import * as React from "react";
import * as styles from "./OrganizationsTemplate.module.css";
import { Link } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@gemeente-denhaag/table";
import { navigate } from "gatsby";
import { Container } from "@conduction/components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useQueryClient } from "react-query";
import { useOrganization } from "../../hooks/organization";
import { translateDate } from "../../services/dateFormat";
import Skeleton from "react-loading-skeleton";
import { Button } from "../../components/button/Button";
import { OverviewPageHeaderTemplate } from "../templateParts/overviewPageHeader/OverviewPageHeaderTemplate";

export const OrganizationsTemplate: React.FC = () => {
  const { t, i18n } = useTranslation();

  const queryClient = useQueryClient();
  const _useOrganizations = useOrganization(queryClient);
  const getOrganizations = _useOrganizations.getAll();

  return (
    <Container layoutClassName={styles.container}>
      <OverviewPageHeaderTemplate
        title={t("Organizations")}
        size="md"
        button={
          <Button
            icon={faPlus}
            variant="primary"
            label={t("Add Organization")}
            onClick={() => navigate(`/settings/organizations/new`)}
          />
        }
      />

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
              <TableRow onClick={() => navigate(`/settings/organizations/${organization.id}`)} key={organization.id}>
                <TableCell>{organization.name}</TableCell>
                <TableCell>{organization.users.length ?? "-"}</TableCell>
                <TableCell>{translateDate(i18n.language, organization.dateCreated) ?? "-"}</TableCell>
                <TableCell>{translateDate(i18n.language, organization.dateModified) ?? "-"}</TableCell>
                <TableCell onClick={() => navigate(`/settings/organizations/${organization.id}`)}>
                  <Link icon={<FontAwesomeIcon icon={faArrowRight} />} iconAlign="start">
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

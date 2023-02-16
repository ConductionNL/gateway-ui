import * as React from "react";
import * as styles from "./UsersTemplate.module.css";
import { Heading1, Link } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@gemeente-denhaag/table";
import { navigate } from "gatsby";
import { Container } from "@conduction/components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useQueryClient } from "react-query";
import { translateDate } from "../../services/dateFormat";
import Skeleton from "react-loading-skeleton";
import { useUser } from "../../hooks/user";
import { Button } from "../../components/button/Button";

export const UsersTemplate: React.FC = () => {
  const { t, i18n } = useTranslation();

  const queryClient = useQueryClient();
  const _useUsers = useUser(queryClient);
  const getUsers = _useUsers.getAll();

  return (
    <Container layoutClassName={styles.container}>
      <section className={styles.section}>
        <Heading1>{t("Users")}</Heading1>

        <div className={styles.buttons}>
          <Button
            variant="primary"
            icon={faPlus}
            label={t("Add User")}
            onClick={() => navigate(`/settings/users/new`)}
          />
        </div>
      </section>

      {getUsers.isSuccess && (
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>{t("Name")}</TableHeader>
              <TableHeader>{t("Organization")}</TableHeader>
              <TableHeader>{t("User groups")}</TableHeader>
              <TableHeader>{t("Date created")}</TableHeader>
              <TableHeader>{t("Date modified")}</TableHeader>
              <TableHeader></TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {getUsers.data.map((user: any) => (
              <TableRow
                className={styles.tableRow}
                onClick={() => navigate(`/settings/users/${user.id}`)}
                key={user.id}
              >
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.organisation.name ?? "-"}</TableCell>
                <TableCell>{user.securityGroups?.length ?? "-"}</TableCell>
                <TableCell>{translateDate(i18n.language, user.dateCreated) ?? "-"}</TableCell>
                <TableCell>{translateDate(i18n.language, user.dateModified) ?? "-"}</TableCell>
                <TableCell onClick={() => navigate(`/settings/users/${user.id}`)}>
                  <Link icon={<FontAwesomeIcon icon={faArrowRight} />} iconAlign="start">
                    {t("Details")}
                  </Link>
                </TableCell>
              </TableRow>
            ))}
            {!getUsers.data.length && (
              <TableRow>
                <TableCell>No users found</TableCell>
                <TableCell />
                <TableCell />
                <TableCell />
                <TableCell />
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}

      {getUsers.isLoading && <Skeleton height={200} />}
    </Container>
  );
};

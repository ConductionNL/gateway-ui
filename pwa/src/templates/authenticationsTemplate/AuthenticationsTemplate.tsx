import * as React from "react";
import * as styles from "./AuthenticationsTemplate.module.css";
import { Button, Heading1, Link } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@gemeente-denhaag/table";
import { navigate } from "gatsby";
import { Container } from "@conduction/components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { ArrowRightIcon } from "@gemeente-denhaag/icons";
import { translateDate } from "../../services/dateFormat";
import { QueryClient } from "react-query";
import Skeleton from "react-loading-skeleton";
import clsx from "clsx";
import { useAuthentication } from "../../hooks/authentication";

export const AuthenticationsTemplate: React.FC = () => {
  const { t, i18n } = useTranslation();

  const queryClient = new QueryClient();
  const _useAuthentication = useAuthentication(queryClient);
  const getAuthentication = _useAuthentication.getAll();
  const deleteAuthentication = _useAuthentication.remove("");

  const handleDeleteObject = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.TouchEvent<HTMLButtonElement>,
    authenticationId: string,
  ) => {
    e.stopPropagation();

    const confirmDeletion = confirm("Are you sure you want to delete this authentication?");

    if (confirmDeletion) {
      deleteAuthentication.mutate({ id: authenticationId });
    }
  };

  return (
    <Container layoutClassName={styles.container}>
      <section className={styles.section}>
        <Heading1>{t("Authentication")}</Heading1>
        <div className={styles.buttons}>
          <Button className={styles.buttonIcon} onClick={() => navigate(`/settings/authentication/new`)}>
            <FontAwesomeIcon icon={faPlus} />
            {t("Add Authentication")}
          </Button>
        </div>
      </section>

      {getAuthentication.isSuccess && (
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>{t("Name")}</TableHeader>
              <TableHeader>{t("Number of Scopes")}</TableHeader>
              <TableHeader>{t("DateCreated")}</TableHeader>
              <TableHeader>{t("DateModified")}</TableHeader>
              <TableHeader></TableHeader>
              <TableHeader></TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {getAuthentication.data.map((authentication) => (
              <TableRow
                className={styles.tableRow}
                onClick={() => navigate(`/settings/authentication/${authentication.id}`)}
                key={authentication.id}
              >
                <TableCell>{authentication.name}</TableCell>
                <TableCell>{authentication.scopes.length}</TableCell>
                <TableCell>{translateDate(i18n.language, authentication.dateCreated)}</TableCell>
                <TableCell>{translateDate(i18n.language, authentication.dateModified)}</TableCell>
                <TableCell>
                  <Button
                    onClick={(e) => handleDeleteObject(e, authentication.id)}
                    className={clsx(styles.buttonIcon, styles.deleteButton)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                    {t("Delete")}
                  </Button>
                </TableCell>
                <TableCell onClick={() => navigate(`/settings/authentication/${authentication.id}`)}>
                  <Link icon={<ArrowRightIcon />} iconAlign="start">
                    {t("Details")}
                  </Link>
                </TableCell>
              </TableRow>
            ))}
            {!getAuthentication.data.length && (
              <TableRow>
                <TableCell>{t("No authentications found")}</TableCell>
                <TableCell />
                <TableCell />
                <TableCell />
                <TableCell />
                <TableCell />
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
      {getAuthentication.isLoading && <Skeleton height="200px" />}
    </Container>
  );
};

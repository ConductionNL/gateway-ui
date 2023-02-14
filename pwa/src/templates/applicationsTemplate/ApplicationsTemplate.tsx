import * as React from "react";
import * as styles from "./ApplicationsTemplate.module.css";
import { Button, Heading1, Link } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@gemeente-denhaag/table";
import { navigate } from "gatsby";
import { Container } from "@conduction/components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { translateDate } from "../../services/dateFormat";
import { QueryClient } from "react-query";
import { useApplication } from "../../hooks/application";
import Skeleton from "react-loading-skeleton";
import clsx from "clsx";

export const ApplicationsTemplate: React.FC = () => {
  const { t, i18n } = useTranslation();

  const queryClient = new QueryClient();
  const _useApplication = useApplication(queryClient);
  const getApplication = _useApplication.getAll();
  const deleteApplication = _useApplication.remove();

  const handleDeleteObject = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.TouchEvent<HTMLButtonElement>,
    objectId: string,
  ) => {
    e.stopPropagation();

    const confirmDeletion = confirm("Are you sure you want to delete this object?");

    if (confirmDeletion) {
      deleteApplication.mutate({ id: objectId });
    }
  };

  return (
    <Container layoutClassName={styles.container}>
      <section className={styles.section}>
        <Heading1>{t("Applications")}</Heading1>
        <div className={styles.buttons}>
          <Button className={styles.buttonIcon} onClick={() => navigate(`/settings/applications/new`)}>
            <FontAwesomeIcon icon={faPlus} />
            {t("Add Application")}
          </Button>
        </div>
      </section>

      {getApplication.isSuccess && (
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>{t("Name")}</TableHeader>
              <TableHeader>{t("Description")}</TableHeader>
              <TableHeader>{t("DateCreated")}</TableHeader>
              <TableHeader>{t("DateModified")}</TableHeader>
              <TableHeader></TableHeader>
              <TableHeader></TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {getApplication.data.map((application) => (
              <TableRow
                className={styles.tableRow}
                onClick={() => navigate(`/settings/applications/${application.id}`)}
                key={application.id}
              >
                <TableCell>{application.name}</TableCell>
                <TableCell>{application.description ?? "-"}</TableCell>
                <TableCell>{translateDate(i18n.language, application.dateCreated)}</TableCell>
                <TableCell>{translateDate(i18n.language, application.dateModified)}</TableCell>
                <TableCell>
                  <Button
                    onClick={(e) => handleDeleteObject(e, application.id)}
                    className={clsx(styles.buttonIcon, styles.deleteButton)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                    {t("Delete")}
                  </Button>
                </TableCell>
                <TableCell onClick={() => navigate(`/settings/applications/${application.id}`)}>
                  <Link icon={<FontAwesomeIcon icon={faArrowRight} />} iconAlign="start">
                    {t("Details")}
                  </Link>
                </TableCell>
              </TableRow>
            ))}
            {!getApplication.data.length && (
              <TableRow>
                <TableCell>{t("No applications found")}</TableCell>
                <TableCell />
                <TableCell />
                <TableCell />
                <TableCell />
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
      {getApplication.isLoading && <Skeleton height="200px" />}
    </Container>
  );
};

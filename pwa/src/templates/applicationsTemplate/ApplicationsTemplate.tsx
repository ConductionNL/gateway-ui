import * as React from "react";
import * as styles from "./ApplicationsTemplate.module.css";
import { Link } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@gemeente-denhaag/table";
import { navigate } from "gatsby";
import { Container } from "@conduction/components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { translateDate } from "../../services/dateFormat";
import { useQueryClient } from "react-query";
import { useApplication } from "../../hooks/application";
import Skeleton from "react-loading-skeleton";
import { Button } from "../../components/button/Button";
import { OverviewPageHeaderTemplate } from "../templateParts/overviewPageHeader/OverviewPageHeaderTemplate";

export const ApplicationsTemplate: React.FC = () => {
  const { t, i18n } = useTranslation();

  const queryClient = useQueryClient();
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
      <OverviewPageHeaderTemplate
        title={t("Applications")}
        size="md"
        button={
          <Button
            variant="primary"
            label={t("Add Application")}
            onClick={() => navigate("/settings/applications/new")}
            icon={faPlus}
          />
        }
      />

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
              <TableRow onClick={() => navigate(`/settings/applications/${application.id}`)} key={application.id}>
                <TableCell>{application.name}</TableCell>
                <TableCell>{application.description ?? "-"}</TableCell>
                <TableCell>{translateDate(i18n.language, application.dateCreated)}</TableCell>
                <TableCell>{translateDate(i18n.language, application.dateModified)}</TableCell>
                <TableCell>
                  <Button
                    variant="danger"
                    icon={faTrash}
                    label={t("Delete")}
                    onClick={(e) => handleDeleteObject(e, application.id)}
                  />
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

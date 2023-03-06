import * as React from "react";
import * as styles from "./ApplicationsTemplate.module.css";
import { Link } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@gemeente-denhaag/table";
import { navigate } from "gatsby";
import { Container } from "@conduction/components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faPlus } from "@fortawesome/free-solid-svg-icons";
import { translateDate } from "../../services/dateFormat";
import { useQueryClient } from "react-query";
import { useApplication } from "../../hooks/application";
import Skeleton from "react-loading-skeleton";
import { Button } from "../../components/button/Button";
import { OverviewPageHeaderTemplate } from "../templateParts/overviewPageHeader/OverviewPageHeaderTemplate";
import { useBulkSelect } from "../../hooks/useBulkSelect";
import { BulkActionButton } from "../../components/bulkActionButton/BulkActionButton";

export const ApplicationsTemplate: React.FC = () => {
  const { t, i18n } = useTranslation();

  const queryClient = useQueryClient();
  const _useApplication = useApplication(queryClient);
  const getApplications = _useApplication.getAll();
  const deleteApplication = _useApplication.remove();

  const { CheckboxBulkSelectAll, CheckboxBulkSelectOne, selectedItems } = useBulkSelect(getApplications.data);

  const handleBulkDelete = (): void => {
    selectedItems.forEach((item) => deleteApplication.mutate({ id: item }));
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

      {getApplications.isSuccess && (
        <div>
          <BulkActionButton
            actions={[{ type: "delete", onSubmit: handleBulkDelete }]}
            selectedItemsCount={selectedItems.length}
          />

          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>
                  <CheckboxBulkSelectAll />
                </TableHeader>
                <TableHeader>{t("Name")}</TableHeader>
                <TableHeader>{t("Description")}</TableHeader>
                <TableHeader>{t("DateCreated")}</TableHeader>
                <TableHeader>{t("DateModified")}</TableHeader>
                <TableHeader />
              </TableRow>
            </TableHead>
            <TableBody>
              {getApplications.data.map((application) => (
                <TableRow key={application.id}>
                  <TableCell>{<CheckboxBulkSelectOne id={application.id} />}</TableCell>

                  <TableCell>{application.name}</TableCell>

                  <TableCell>{application.description ?? "-"}</TableCell>

                  <TableCell>{translateDate(i18n.language, application.dateCreated)}</TableCell>

                  <TableCell>{translateDate(i18n.language, application.dateModified)}</TableCell>

                  <TableCell onClick={() => navigate(`/settings/applications/${application.id}`)}>
                    <Link icon={<FontAwesomeIcon icon={faArrowRight} />} iconAlign="start">
                      {t("Details")}
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
              {!getApplications.data.length && (
                <TableRow>
                  <TableCell>{t("No applications found")}</TableCell>
                  <TableCell />
                  <TableCell />
                  <TableCell />
                  <TableCell />
                  <TableCell />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
      {getApplications.isLoading && <Skeleton height="200px" />}
    </Container>
  );
};

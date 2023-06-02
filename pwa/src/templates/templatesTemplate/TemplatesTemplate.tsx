import * as React from "react";
import * as styles from "./TemplatesTemplate.module.css";
import { Link } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { useTemplate } from "../../hooks/template";
import { Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from "@gemeente-denhaag/table";
import { navigate } from "gatsby";
import { useQueryClient } from "react-query";
import { Container } from "@conduction/components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faPlus } from "@fortawesome/free-solid-svg-icons";
import Skeleton from "react-loading-skeleton";
import { Button } from "../../components/button/Button";
import { OverviewPageHeaderTemplate } from "../templateParts/overviewPageHeader/OverviewPageHeaderTemplate";
import { useBulkSelect } from "../../hooks/useBulkSelect";
import { BulkActionButton } from "../../components/bulkActionButton/BulkActionButton";
import { ActionButton } from "../../components/actionButton/ActionButton";
import { translateDate } from "../../services/dateFormat";

export const TemplatesTemplate: React.FC = () => {
  const { t, i18n } = useTranslation();

  const queryClient = useQueryClient();
  const _useTemplate = useTemplate(queryClient);
  const getTemplates = _useTemplate.getAll();
  const deleteTemplate = _useTemplate.remove();
  const downloadTemplate = _useTemplate.downloadPDF();

  const { CheckboxBulkSelectAll, CheckboxBulkSelectOne, selectedItems, toggleItem } = useBulkSelect(getTemplates.data);

  const handleBulkDelete = (): void => {
    selectedItems.forEach((item) => deleteTemplate.mutate({ id: item }));
  };

  return (
    <Container layoutClassName={styles.container}>
      <OverviewPageHeaderTemplate
        title={t("Templates")}
        button={
          <Button
            label={t("Add Template")}
            icon={faPlus}
            variant="primary"
            onClick={() => navigate("/templates/new")}
          />
        }
      />

      {getTemplates.isError && "Error..."}

      {getTemplates.isSuccess && (
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
                <TableHeader>{t("Organization")}</TableHeader>
                <TableHeader>{t("Date Created")}</TableHeader>
                <TableHeader>{t("Date Modified")}</TableHeader>
                <TableHeader>{t("Actions")}</TableHeader>
                <TableHeader />
              </TableRow>
            </TableHead>
            <TableBody>
              {getTemplates.data.map((template) => (
                <TableRow key={"template.id"} onClick={() => toggleItem(template.id)}>
                  <TableCell>{<CheckboxBulkSelectOne id={template.id} />}</TableCell>

                  <TableCell>{template.name}</TableCell>

                  <TableCell>{template.organization.name}</TableCell>

                  <TableCell>{translateDate(i18n.language, template.dateCreated) ?? "-"}</TableCell>

                  <TableCell>{translateDate(i18n.language, template.dateModified) ?? "-"}</TableCell>

                  <TableCell>
                    <ActionButton
                      actions={[
                        { type: "delete", onSubmit: () => deleteTemplate.mutate({ id: template.id }) },
                        { type: "download", onSubmit: () => downloadTemplate.mutate({ id: template.id }) },
                      ]}
                      variant="primary"
                    />
                  </TableCell>

                  <TableCell onClick={() => navigate(`/templates/${template.id}`)}>
                    <Link icon={<FontAwesomeIcon icon={faArrowRight} />} iconAlign="start">
                      {t("Details")}
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
              {!getTemplates.data.length && (
                <TableRow>
                  <TableCell>{t("No templates found")}</TableCell>
                  <TableCell />
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

      {getTemplates.isLoading && <Skeleton height="200px" />}
    </Container>
  );
};

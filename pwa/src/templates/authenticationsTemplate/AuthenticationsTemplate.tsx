import * as React from "react";
import * as styles from "./AuthenticationsTemplate.module.css";
import { Link } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@gemeente-denhaag/table";
import { navigate } from "gatsby";
import { Container } from "@conduction/components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faPlus } from "@fortawesome/free-solid-svg-icons";
import { translateDate } from "../../services/dateFormat";
import { useQueryClient } from "react-query";
import Skeleton from "react-loading-skeleton";
import { useAuthentication } from "../../hooks/authentication";
import { Button } from "../../components/button/Button";
import { OverviewPageHeaderTemplate } from "../templateParts/overviewPageHeader/OverviewPageHeaderTemplate";
import { useBulkSelect } from "../../hooks/useBulkSelect";
import { BulkActionButton } from "../../components/bulkActionButton/BulkActionButton";

export const AuthenticationsTemplate: React.FC = () => {
  const { t, i18n } = useTranslation();

  const queryClient = useQueryClient();
  const _useAuthentication = useAuthentication(queryClient);
  const getAuthentications = _useAuthentication.getAll();
  const deleteAuthentication = _useAuthentication.remove();

  const { CheckboxBulkSelectAll, CheckboxBulkSelectOne, selectedItems, toggleItem } = useBulkSelect(
    getAuthentications.data,
  );

  const handleBulkDelete = (): void => {
    selectedItems.forEach((item) => deleteAuthentication.mutate({ id: item }));
  };

  return (
    <Container layoutClassName={styles.container}>
      <OverviewPageHeaderTemplate
        title={t("Authentication Provider")}
        size="md"
        button={
          <Button
            variant="primary"
            icon={faPlus}
            label={t("Add Authentication Provider")}
            onClick={() => navigate(`/settings/authentication/new`)}
          />
        }
      />

      {getAuthentications.isSuccess && (
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
                <TableHeader>{t("Provider Name")}</TableHeader>
                <TableHeader>{t("Number of Scopes")}</TableHeader>
                <TableHeader>{t("DateCreated")}</TableHeader>
                <TableHeader>{t("DateModified")}</TableHeader>
                <TableHeader />
              </TableRow>
            </TableHead>
            <TableBody>
              {getAuthentications.data.map((authentication) => (
                <TableRow key={authentication.id} onClick={() => toggleItem(authentication.id)}>
                  <TableCell>{<CheckboxBulkSelectOne id={authentication.id} />}</TableCell>

                  <TableCell>{authentication.name}</TableCell>

                  <TableCell>{authentication.scopes.length}</TableCell>

                  <TableCell>{translateDate(i18n.language, authentication.dateCreated)}</TableCell>

                  <TableCell>{translateDate(i18n.language, authentication.dateModified)}</TableCell>

                  <TableCell onClick={() => navigate(`/settings/authentication/${authentication.id}`)}>
                    <Link icon={<FontAwesomeIcon icon={faArrowRight} />} iconAlign="start">
                      {t("Details")}
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
              {!getAuthentications.data.length && (
                <TableRow>
                  <TableCell>{t("No authentication providers found")}</TableCell>
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
      {getAuthentications.isLoading && <Skeleton height="200px" />}
    </Container>
  );
};

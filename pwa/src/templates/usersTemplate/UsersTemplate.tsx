import * as React from "react";
import * as styles from "./UsersTemplate.module.css";
import { Link } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@gemeente-denhaag/table";
import { navigate } from "gatsby";
import { Container, ToolTip } from "@conduction/components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useQueryClient } from "react-query";
import { translateDate } from "../../services/dateFormat";
import Skeleton from "react-loading-skeleton";
import { useUser } from "../../hooks/user";
import { Button } from "../../components/button/Button";
import { OverviewPageHeaderTemplate } from "../templateParts/overviewPageHeader/OverviewPageHeaderTemplate";
import { useBulkSelect } from "../../hooks/useBulkSelect";
import { BulkActionButton } from "../../components/bulkActionButton/BulkActionButton";

export const UsersTemplate: React.FC = () => {
  const { t, i18n } = useTranslation();

  const queryClient = useQueryClient();
  const _useUsers = useUser(queryClient);
  const getUsers = _useUsers.getAll();
  const deleteUser = _useUsers.remove();

  const { CheckboxBulkSelectAll, CheckboxBulkSelectOne, selectedItems, toggleItem } = useBulkSelect(getUsers.data);

  const handleBulkDelete = (): void => {
    selectedItems.forEach((item) => deleteUser.mutate({ id: item }));
  };

  return (
    <Container layoutClassName={styles.container}>
      <OverviewPageHeaderTemplate
        title={t("Users")}
        size="md"
        button={
          <Button
            variant="primary"
            icon={faPlus}
            label={t("Add User")}
            onClick={() => navigate(`/settings/users/new`)}
          />
        }
      />

      {getUsers.isSuccess && (
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
                <TableHeader>{t("Applications")}</TableHeader>
                <TableHeader>{t("Security groups")}</TableHeader>
                <TableHeader>{t("Date created")}</TableHeader>
                <TableHeader>{t("Date modified")}</TableHeader>
                <TableHeader />
              </TableRow>
            </TableHead>
            <TableBody>
              {getUsers.data.map((user: any) => (
                <TableRow key={user.id} onClick={() => toggleItem(user.id)}>
                  <TableCell>{<CheckboxBulkSelectOne id={user.id} />}</TableCell>

                  <TableCell>{user.name}</TableCell>

                  <TableCell>{user.organization.name ?? "-"}</TableCell>

                  <TableCell>
                    <ToolTip tooltip={user.applications.map((application: any) => application.name).join(", ")}>
                      {user.applications?.length ?? "-"}
                    </ToolTip>
                  </TableCell>

                  <TableCell>
                    <ToolTip tooltip={user.securityGroups.map((securityGroup: any) => securityGroup.name).join(", ")}>
                      {user.securityGroups?.length ?? "-"}
                    </ToolTip>
                  </TableCell>

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
                  <TableCell />
                  <TableCell />
                  <TableCell />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {getUsers.isLoading && <Skeleton height={200} />}
    </Container>
  );
};

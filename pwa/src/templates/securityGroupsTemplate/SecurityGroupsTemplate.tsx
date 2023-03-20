import * as React from "react";
import * as styles from "./SecurityGroupsTemplate.module.css";
import { Link } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@gemeente-denhaag/table";
import { navigate } from "gatsby";
import { Container } from "@conduction/components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useSecurityGroup } from "../../hooks/securityGroup";
import { useQueryClient } from "react-query";
import Skeleton from "react-loading-skeleton";
import { Button } from "../../components/button/Button";
import { OverviewPageHeaderTemplate } from "../templateParts/overviewPageHeader/OverviewPageHeaderTemplate";
import { useBulkSelect } from "../../hooks/useBulkSelect";
import { BulkActionButton } from "../../components/bulkActionButton/BulkActionButton";

export const SecurityGroupsTemplate: React.FC = () => {
  const { t } = useTranslation();

  const queryClient = useQueryClient();
  const _useSecurityGroups = useSecurityGroup(queryClient);
  const getSecurityGroups = _useSecurityGroups.getAll();
  const deleteSecurityGroup = _useSecurityGroups.remove();

  const { CheckboxBulkSelectAll, CheckboxBulkSelectOne, selectedItems } = useBulkSelect(getSecurityGroups.data);

  const handleBulkDelete = (): void => {
    selectedItems.forEach((item) => deleteSecurityGroup.mutate({ id: item }));
  };

  return (
    <Container layoutClassName={styles.container}>
      <OverviewPageHeaderTemplate
        title={t("Security groups")}
        size="md"
        button={
          <Button
            variant="primary"
            icon={faPlus}
            label={t("Add Security group")}
            onClick={() => navigate(`/settings/securitygroups/new`)}
          />
        }
      />

      {getSecurityGroups.isSuccess && (
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
                <TableHeader>{t("Config")}</TableHeader>
                <TableHeader />
              </TableRow>
            </TableHead>
            <TableBody>
              {getSecurityGroups.data.map((securityGroup) => (
                <TableRow key={securityGroup.id}>
                  <TableCell>{<CheckboxBulkSelectOne id={securityGroup.id} />}</TableCell>

                  <TableCell>{securityGroup.name}</TableCell>

                  <TableCell>{securityGroup.description ?? "-"}</TableCell>

                  <TableCell>{securityGroup.config ?? "-"}</TableCell>

                  <TableCell onClick={() => navigate(`/settings/securitygroups/${securityGroup.id}`)}>
                    <Link icon={<FontAwesomeIcon icon={faArrowRight} />} iconAlign="start">
                      {t("Details")}
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      {getSecurityGroups.isLoading && <Skeleton height={"200px"} />}
    </Container>
  );
};

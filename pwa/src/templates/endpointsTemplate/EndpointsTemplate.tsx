import * as React from "react";
import * as styles from "./EndpointsTemplate.module.css";
import { useTranslation } from "react-i18next";
import { Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from "@gemeente-denhaag/table";
import { navigate } from "gatsby";
import { useEndpoint } from "../../hooks/endpoint";
import { useQueryClient } from "react-query";
import { Container } from "@conduction/components";
import Skeleton from "react-loading-skeleton";
import { faArrowRight, faPlus } from "@fortawesome/free-solid-svg-icons";
import { translateDate } from "../../services/dateFormat";
import { Button } from "../../components/button/Button";
import { OverviewPageHeaderTemplate } from "../templateParts/overviewPageHeader/OverviewPageHeaderTemplate";
import { StatusTag } from "../../components/statusTag/StatusTag";
import { useBulkSelect } from "../../hooks/useBulkSelect";
import { BulkActionButton } from "../../components/bulkActionButton/BulkActionButton";
import { Link } from "@gemeente-denhaag/components-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const EndpointsTemplate: React.FC = () => {
  const { t, i18n } = useTranslation();

  const queryClient = useQueryClient();
  const _useEndpoints = useEndpoint(queryClient);
  const getEndpoints = _useEndpoints.getAll();
  const deleteEndpoint = _useEndpoints.remove();

  const { CheckboxBulkSelectAll, CheckboxBulkSelectOne, selectedItems } = useBulkSelect(0, getEndpoints.data);

  const handleBulkDelete = () => {
    selectedItems.forEach((item) => deleteEndpoint.mutate({ id: item }));
  };

  return (
    <Container layoutClassName={styles.container}>
      <OverviewPageHeaderTemplate
        title={t("Endpoints")}
        button={
          <Button
            variant="primary"
            icon={faPlus}
            label={t("Add Endpoint")}
            onClick={() => navigate(`/endpoints/new`)}
          />
        }
      />

      {getEndpoints.isError && "Error..."}

      {getEndpoints.isSuccess && (
        <div>
          <BulkActionButton
            actions={[
              { type: "delete", onSubmit: handleBulkDelete },
              { type: "download", onSubmit: () => alert("Handle download 1") },
              { type: "download", onSubmit: () => alert("Handle download 2") },
              { type: "delete", onSubmit: handleBulkDelete },
            ]}
            selectedItemsCount={selectedItems.length}
            layoutClassName={styles.bulkActionButton}
          />

          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>
                  <CheckboxBulkSelectAll />
                </TableHeader>
                <TableHeader>Name</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader>Path regex</TableHeader>
                <TableHeader>Date Created</TableHeader>
                <TableHeader>Date Modified</TableHeader>
                <TableHeader></TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {getEndpoints.data.map((endpoint: any) => (
                <TableRow key={endpoint.id}>
                  <TableCell>{<CheckboxBulkSelectOne id={endpoint.id} />}</TableCell>

                  <TableCell>{endpoint.name}</TableCell>

                  <TableCell>
                    {endpoint.status && <StatusTag type="success" label={endpoint.status?.toString()} />}
                    {endpoint.status === false && (
                      <StatusTag type="critical" label={endpoint.status?.toString() ?? "No status"} />
                    )}
                    {endpoint.status === null && <StatusTag label={"No status"} />}
                  </TableCell>

                  <TableCell>{!!endpoint.pathRegex ? endpoint.pathRegex : "-"}</TableCell>

                  <TableCell>{translateDate(i18n.language, endpoint.dateCreated)}</TableCell>

                  <TableCell>{translateDate(i18n.language, endpoint.dateModified)}</TableCell>

                  <TableCell onClick={() => navigate(`/endpoints/${endpoint.id}`)}>
                    <Link icon={<FontAwesomeIcon icon={faArrowRight} />} iconAlign="start">
                      {t("Details")}
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
              {!getEndpoints.data.length && (
                <TableRow>
                  <TableCell>{t("No endpoints found")}</TableCell>
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

      {getEndpoints.isLoading && <Skeleton height="200px" />}
    </Container>
  );
};

import * as React from "react";
import * as styles from "./EndpointsTemplate.module.css";
import { useTranslation } from "react-i18next";
import { Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from "@gemeente-denhaag/table";
import { navigate } from "gatsby";
import { useEndpoint } from "../../hooks/endpoint";
import { useQueryClient } from "react-query";
import { Container } from "@conduction/components";
import Skeleton from "react-loading-skeleton";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { translateDate } from "../../services/dateFormat";
import { Button } from "../../components/button/Button";
import { OverviewPageHeaderTemplate } from "../templateParts/overviewPageHeader/OverviewPageHeaderTemplate";
import { StatusTag } from "../../components/statusTag/StatusTag";

export const EndpointsTemplate: React.FC = () => {
  const { t, i18n } = useTranslation();

  const queryClient = useQueryClient();
  const _useEndpoints = useEndpoint(queryClient);
  const getEndpoints = _useEndpoints.getAll();

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
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>Name</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader>Path regex</TableHeader>
              <TableHeader>Date Created</TableHeader>
              <TableHeader>Date Modified</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {getEndpoints.data.map((endpoint: any) => (
              <TableRow onClick={() => navigate(`/endpoints/${endpoint.id}`)} key={endpoint.id}>
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
              </TableRow>
            ))}
            {!getEndpoints.data.length && (
              <TableRow>
                <TableCell>{t("No endpoints found")}</TableCell>
                <TableCell />
                <TableCell />
                <TableCell />
                <TableCell />
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}

      {getEndpoints.isLoading && <Skeleton height="200px" />}
    </Container>
  );
};

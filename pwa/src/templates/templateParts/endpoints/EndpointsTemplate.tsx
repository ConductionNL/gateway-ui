import * as React from "react";
import * as styles from "./EndpointsTemplate.module.css";
import { Heading1 } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from "@gemeente-denhaag/table";
import { navigate } from "gatsby";
import { useEndpoint } from "../../../hooks/endpoints";
import { QueryClient } from "react-query";
import { Container, Tag } from "@conduction/components";
import Skeleton from "react-loading-skeleton";
import clsx from "clsx";

export const EndpointsTemplate: React.FC = () => {
  const { t } = useTranslation();

  const queryClient = new QueryClient();
  const _useEndpoints = useEndpoint(queryClient);
  const getEndpoints = _useEndpoints.getAll();

  return (
    <Container layoutClassName={styles.container}>
      <Heading1>{t("Endpoints")}</Heading1>

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
              <TableHeader>Throws</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {getEndpoints.data.map((endpoint: any) => (
              <TableRow onClick={() => navigate(`/endpoints/${endpoint.id}`)} key={endpoint.id}>
                <TableCell>{endpoint.name}</TableCell>
                <TableCell>
                  <div className={clsx(styles[endpoint.status === "Ok" ? "statusOk" : "statusFailed"])}>
                    <Tag label={endpoint.status?.toString() ?? "-"} />
                  </div>
                </TableCell>
                <TableCell>{endpoint.pathRegex ?? "-"}</TableCell>
                <TableCell>{endpoint.dateCreated ?? "-"}</TableCell>
                <TableCell>{endpoint.dateModified ?? "-"}</TableCell>
                <TableCell>{endpoint.throws ?? "-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {getEndpoints.isLoading && <Skeleton height="200px" />}
    </Container>
  );
};

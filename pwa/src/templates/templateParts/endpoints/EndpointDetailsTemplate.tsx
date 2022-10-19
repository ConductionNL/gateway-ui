import * as React from "react";
import { Heading1 } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { QueryClient } from "react-query";
import { useEndpoint } from "../../../hooks/endpoints";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@gemeente-denhaag/table";

interface EndpointDetailsTemplateProps {
  endpointId: string;
}

export const EndpointDetailTemplate: React.FC<EndpointDetailsTemplateProps> = ({ endpointId }) => {
  const { t } = useTranslation();

  const queryClient = new QueryClient();
  const _useEndpoints = useEndpoint(queryClient);
  const getEndpoints = _useEndpoints.getOne(endpointId);

  return (
    <>
      <Heading1>{t("Endpoint detail page")}</Heading1>

      {getEndpoints.isLoading && "Loading..."}
      {getEndpoints.isError && "Error..."}

      {getEndpoints.isSuccess && (
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>Name</TableHeader>
              <TableHeader>Description</TableHeader>
              <TableHeader>Path Regex</TableHeader>
              <TableHeader>Method</TableHeader>
              <TableHeader>Tag</TableHeader>
              <TableHeader>Throws</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
              <TableRow>
                <TableCell>{getEndpoints.data.name}</TableCell>
                <TableCell>{getEndpoints.data.description ?? "-"}</TableCell>
                <TableCell>{getEndpoints.data.pathRegex ?? "-"}</TableCell>
                <TableCell>{getEndpoints.data.method ?? "-"}</TableCell>
                <TableCell>{getEndpoints.data.tag ?? "-"}</TableCell>
                <TableCell>{getEndpoints.data.throws ?? "-"}</TableCell>
              </TableRow>
          </TableBody>
        </Table>
      )}
    </>
  );
};

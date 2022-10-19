import * as React from "react";
import { Heading1 } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { useAction } from "../../../hooks/action";
import { Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from "@gemeente-denhaag/table";
import { navigate } from "gatsby";
import { QueryClient } from "react-query";

export const ActionsTemplate: React.FC = () => {
  const { t } = useTranslation();

  const queryClient = new QueryClient();
  const _useActions = useAction(queryClient);
  const getActions = _useActions.getAll();

  return (
    <div>
      <Heading1>{t("Actions")}</Heading1>

      {getActions.isLoading && "Loading..."}
      {getActions.isError && "Error..."}

      {getActions.isSuccess && (
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>Name</TableHeader>
              <TableHeader>Priority</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader>Last run</TableHeader>
              <TableHeader>Last run time</TableHeader>
              <TableHeader>Date Created</TableHeader>
              <TableHeader>Date Modified</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {getActions.data.map((action) => (
              <TableRow onClick={() => navigate(`/actions/${action.id}`)} key={action.id}>
                <TableCell>{action.name}</TableCell>
                <TableCell>{action.priority}</TableCell>
                <TableCell>{action.status ? "On" : "Off"}</TableCell>
                <TableCell>{action.lastRun ?? "-"}</TableCell>
                <TableCell>{action.lastRunTime ?? "-"}</TableCell>
                <TableCell>{action.dateCreated ?? "-"}</TableCell>
                <TableCell>{action.dateModified ?? "-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

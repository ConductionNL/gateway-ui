import * as React from "react";
import { Heading1 } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { useAction } from "../../../hooks/action";
import { Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from "@gemeente-denhaag/table";
import { navigate } from "gatsby";

export const ActionsTemplate: React.FC = () => {
  const { t } = useTranslation();

  const _useActions = useAction();
  const getActions = _useActions.getAll();

  React.useEffect(() => {
    console.log(getActions.data);
  }, [getActions.isSuccess]);

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
              <TableHeader>Description</TableHeader>
              <TableHeader>Priority</TableHeader>
              <TableHeader>Last run</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {getActions.data.map((action) => (
              <TableRow onClick={() => navigate(`/actions/${action.id}`)} key={action.id}>
                <TableCell>{action.name}</TableCell>
                <TableCell>{action.description}</TableCell>
                <TableCell>{action.priority}</TableCell>
                <TableCell>{action.lastRun ?? "-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

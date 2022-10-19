import * as React from "react";
import * as styles from "./ActionDetailsTemplate.module.css";
import { Heading1, Heading2 } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@gemeente-denhaag/table";
import { useAction } from "../../../hooks/action";
import { QueryClient } from "react-query";
import { Container } from "@conduction/components";

interface ActionDetailsTemplateProps {
  actionId: string;
}

export const ActionsDetailTemplate: React.FC<ActionDetailsTemplateProps> = ({ actionId }) => {
  const { t } = useTranslation();

  const queryClient = new QueryClient();
  const _useActions = useAction(queryClient);
  const getActions = _useActions.getOne(actionId);

  return (
    <Container layoutClassName={styles.container}>
      <Heading1>{t("Action detail page")}</Heading1>

      {getActions.isLoading && "Loading..."}
      {getActions.isError && "Error..."}

      {getActions.isSuccess && (
        <>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Name</TableHeader>
                <TableHeader>Description</TableHeader>
                <TableHeader>Handler</TableHeader>
                <TableHeader>Locked</TableHeader>
                <TableHeader>listens</TableHeader>
                <TableHeader>throws</TableHeader>
                <TableHeader>conditions</TableHeader>
                <TableHeader>Priority</TableHeader>
                <TableHeader>Async</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>{getActions.data.name}</TableCell>
                <TableCell>{getActions.data.description ?? "-"}</TableCell>
                <TableCell>{getActions.data.handler ?? "-"}</TableCell>
                <TableCell>{getActions.data.locked ?? "-"}</TableCell>
                <TableCell>
                  {getActions.data.listens.map((listen: any) => (
                    <>
                      {listen}
                      <br />
                    </>
                  )) ?? "-"}
                </TableCell>
                <TableCell>{getActions.data.throws ?? "-"}</TableCell>
                <TableCell>-</TableCell>
                <TableCell>{getActions.data.priority ?? "-"}</TableCell>
                <TableCell>{getActions.data.async ? "On" : "Off"}</TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <Heading2>Conditions</Heading2>

          <Table>
            <TableHead>
              <TableRow>
                {getActions.data.conditions["=="].map((conditions: any, index: number) => {
                  return index % 2 === 0 && <TableHeader>{conditions?.var ?? conditions}</TableHeader>;
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                {getActions.data.conditions["=="].map((conditions: any, index: number) => {
                  return index % 2 !== 0 && <TableCell>{conditions}</TableCell>;
                })}
              </TableRow>
            </TableBody>
          </Table>
        </>
      )}
    </Container>
  );
};

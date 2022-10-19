import * as React from "react";
import * as styles from "./ObjectsTemplate.module.css";
import { Heading1 } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from "@gemeente-denhaag/table";
import { navigate } from "gatsby";
import { useObject } from "../../hooks/object";
import { QueryClient } from "react-query";
import { Container } from "@conduction/components";
import Skeleton from "react-loading-skeleton";

export const ObjectsTemplate: React.FC = () => {
  const { t } = useTranslation();

  const queryClient = new QueryClient();
  const _useObject = useObject(queryClient);
  const getObject = _useObject.getAll();

  return (
    <Container layoutClassName={styles.container}>
      <Heading1>{t("Objects")}</Heading1>
      {getObject.isLoading && <Skeleton height="200px" />}
      {getObject.isError && "Error..."}
      {getObject.isSuccess && (
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>Name</TableHeader>
              <TableHeader>Id</TableHeader>
              <TableHeader>Description</TableHeader>
              <TableHeader>Priority</TableHeader>
              <TableHeader>Last run</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {getObject.data.map((object) => (
              <TableRow onClick={() => navigate(`/objects/${object.id}`)} key={object.id}>
                <TableCell>{object.name}</TableCell>
                <TableCell>{object.id}</TableCell>
                <TableCell>{object.description ?? "-"}</TableCell>
                <TableCell>{object.priority ?? "-"}</TableCell>
                <TableCell>{object.lastRun ?? "-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Container>
  );
};

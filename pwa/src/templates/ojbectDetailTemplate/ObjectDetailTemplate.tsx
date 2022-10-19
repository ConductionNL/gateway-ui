import * as React from "react";
import * as styles from "./ObjectDetailTemplate.module.css";
import { Heading1 } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { QueryClient } from "react-query";
import { useObject } from "../../hooks/object";
import { Container } from "@conduction/components";
import { Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from "@gemeente-denhaag/table";
import { navigate } from "gatsby";

interface ObjectDetailTemplateProps {
  objectId: string;
}

export const ObjectDetailTemplate: React.FC<ObjectDetailTemplateProps> = ({ objectId }) => {
  const { t } = useTranslation();

  const queryClient = new QueryClient();
  const _useObject = useObject(queryClient);
  const getObject = _useObject.getOne(objectId);

  return (
    <Container layoutClassName={styles.container}>
      <div>
        <Heading1>{t("Object detail page")}</Heading1>
      </div>
      {getObject.isLoading && "Loading..."}
      {getObject.isError && "Error..."}
      {getObject.isSuccess && (
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>Name</TableHeader>
              <TableHeader>Id</TableHeader>
              <TableHeader>Description</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>{getObject.data.name}</TableCell>
              <TableCell>{getObject.data.id}</TableCell>
              <TableCell>{getObject.data.description ?? "-"}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )}
    </Container>
  );
};

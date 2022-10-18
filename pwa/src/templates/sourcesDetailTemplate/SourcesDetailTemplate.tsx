import * as React from "react";
import * as styles from "./SourcesDetailTemplate.module.css";
import { Heading1, Link } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@gemeente-denhaag/table";
import { QueryClient } from "react-query";
import _ from "lodash";
import { useSources } from "../../hooks/sources";
import { Container } from "@conduction/components";
import { navigate } from "gatsby";
import { ArrowLeftIcon } from "@gemeente-denhaag/icons";

interface SourcesDetailTemplateProps {
  sourceId: string;
}

export const SourcesDetailTemplate: React.FC<SourcesDetailTemplateProps> = ({ sourceId }) => {
  const { t } = useTranslation();

  const queryClient = new QueryClient();
  const _useSources = useSources(queryClient);
  const _getSources = _useSources.getOne(sourceId);

  return (
    <Container layoutClassName={styles.container}>
      <Heading1>{t("Sources")}</Heading1>
      <div className={styles.backButton} onClick={() => navigate("/sources")}>
        <Link icon={<ArrowLeftIcon />} iconAlign="start">
          {t("Back to sources")}
        </Link>
      </div>

      {_getSources.isLoading && "Loading..."}
      {_getSources.isError && "Error..."}

      {_getSources.isSuccess && (
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>Name</TableHeader>
              <TableHeader>Description</TableHeader>
              <TableHeader>Location</TableHeader>
              <TableHeader>contentType</TableHeader>
              <TableHeader>accept</TableHeader>
              <TableHeader>auth type</TableHeader>
              <TableHeader>DateCreated</TableHeader>
              <TableHeader>DateModified</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>{_getSources.data.name ?? "-"}</TableCell>
              <TableCell>{_getSources.data.description ?? "-"}</TableCell>
              <TableCell>{_getSources.data.location ?? "-"}</TableCell>
              <TableCell>{_getSources.data.contentType ?? "-"}</TableCell>
              <TableCell>{_getSources.data.accept ?? "-"}</TableCell>
              <TableCell>{_getSources.data.auth ?? "-"}</TableCell>
              <TableCell>{_getSources.data.dateCreated ?? "-"}</TableCell>
              <TableCell>{_getSources.data.dateModified ?? "-"}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )}
    </Container>
  );
};

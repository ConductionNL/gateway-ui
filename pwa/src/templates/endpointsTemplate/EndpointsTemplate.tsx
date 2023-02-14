import * as React from "react";
import * as styles from "./EndpointsTemplate.module.css";
import { Button, Heading1 } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from "@gemeente-denhaag/table";
import { navigate } from "gatsby";
import { useEndpoint } from "../../hooks/endpoint";
import { QueryClient } from "react-query";
import { Container, Tag } from "@conduction/components";
import Skeleton from "react-loading-skeleton";
import clsx from "clsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { translateDate } from "../../services/dateFormat";

export const EndpointsTemplate: React.FC = () => {
  const { t, i18n } = useTranslation();

  const queryClient = new QueryClient();
  const _useEndpoints = useEndpoint(queryClient);
  const getEndpoints = _useEndpoints.getAll();

  return (
    <Container layoutClassName={styles.container}>
      <section className={styles.section}>
        <Heading1>{t("Endpoints")}</Heading1>
        <div className={styles.buttons}>
          <Button className={styles.buttonIcon} onClick={() => navigate(`/endpoints/new`)}>
            <FontAwesomeIcon icon={faPlus} />
            {t("Add Endpoint")}
          </Button>
        </div>
      </section>

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
                  <div
                    className={clsx(
                      endpoint.status === "Ok" ? styles.statusOk : "",
                      endpoint.status === false ? styles.statusFailed : "",
                      endpoint.status === null ? styles.statusUnknown : "",
                    )}
                  >
                    <Tag label={endpoint.status?.toString() ?? "Unknown"} />
                  </div>
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

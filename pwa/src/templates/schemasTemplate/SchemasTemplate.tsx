import * as React from "react";
import * as styles from "./SchemasTemplate.module.css";
import { Button, Heading1, Link } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@gemeente-denhaag/table";
import { QueryClient } from "react-query";
import { navigate } from "gatsby";
import { Container } from "@conduction/components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Skeleton from "react-loading-skeleton";
import { ArrowRightIcon } from "@gemeente-denhaag/icons";
import { useSchema } from "../../hooks/schema";

export const SchemasTemplate: React.FC = () => {
  const { t } = useTranslation();

  const queryClient = new QueryClient();
  const _useSchema = useSchema(queryClient);
  const getSchemas = _useSchema.getAll();

  return (
    <Container layoutClassName={styles.container}>
      <section className={styles.section}>
        <Heading1>{t("Schemas")}</Heading1>
        <div className={styles.buttons}>
          <Button className={styles.buttonIcon} onClick={() => navigate(`/schemas/new`)}>
            <FontAwesomeIcon icon={faPlus} />
            {t("Add Schema")}
          </Button>
        </div>
      </section>

      {getSchemas.isError && "Error..."}

      {getSchemas.isSuccess && (
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>{t("Name")}</TableHeader>
              <TableHeader></TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {getSchemas.data.map((schema) => (
              <TableRow className={styles.tableRow} onClick={() => navigate(`/schemas/${schema.id}`)} key={schema.id}>
                <TableCell>{schema.name}</TableCell>

                <TableCell onClick={() => navigate(`/schemas/${schema.id}`)}>
                  <Link icon={<ArrowRightIcon />} iconAlign="start">
                    {t("Details")}
                  </Link>
                </TableCell>
              </TableRow>
            ))}
            {!getSchemas.data.length && (
              <TableRow>
                <TableCell>{t("No schemas found")}</TableCell>
                <TableCell />
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}

      {getSchemas.isLoading && <Skeleton height="200px" />}
    </Container>
  );
};

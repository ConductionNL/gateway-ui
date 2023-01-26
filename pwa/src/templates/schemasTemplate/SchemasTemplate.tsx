import * as React from "react";
import * as styles from "./SchemasTemplate.module.css";
import { Button, Heading1, Link } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@gemeente-denhaag/table";
import { QueryClient } from "react-query";
import { navigate } from "gatsby";
import { Container } from "@conduction/components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faGear } from "@fortawesome/free-solid-svg-icons";
import Skeleton from "react-loading-skeleton";
import { useSchema } from "../../hooks/schema";
import { translateDate } from "../../services/dateFormat";
import { useObject } from "../../hooks/object";

export const SchemasTemplate: React.FC = () => {
  const { t, i18n } = useTranslation();

  const queryClient = new QueryClient();
  const _useSchema = useSchema(queryClient);
  const getSchemas = _useSchema.getAll();

  const _useObject = useObject(queryClient);
  const getObjects = _useObject.getAll();

  const goToCreateObject = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.TouchEvent<HTMLButtonElement>,
    id: string,
  ) => {
    e.stopPropagation();
    navigate(`/objects/new?schema=${id}`);
  };

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
              <TableHeader>{t("Objects")}</TableHeader>
              <TableHeader>{t("Date Created")}</TableHeader>
              <TableHeader>{t("Date Modified")}</TableHeader>
              <TableHeader></TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {getSchemas.data.map((schema) => (
              <TableRow key={schema.id}>
                <TableCell>{schema.name}</TableCell>

                {getObjects.isSuccess && (
                  <TableCell>
                    {getObjects.data.results.filter((object: any) => object._self.schema.id === schema.id).length}
                  </TableCell>
                )}

                {getObjects.isLoading && <TableCell>Loading...</TableCell>}
                {getObjects.isError && <TableCell>Error</TableCell>}
                <TableCell>{translateDate(i18n.language, schema.dateCreated)}</TableCell>

                <TableCell>{translateDate(i18n.language, schema.dateModified)}</TableCell>

                <TableCell className={styles.callsToAction}>
                  <Button onClick={(e) => goToCreateObject(e, schema.id)} className={styles.buttonIcon}>
                    <FontAwesomeIcon icon={faPlus} />
                    {t("Add Object")}
                  </Button>

                  <Button onClick={() => navigate(`/schemas/${schema.id}`)} className={styles.buttonIcon}>
                    <FontAwesomeIcon icon={faGear} />
                    {t("Edit Schema")}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {!getSchemas.data.length && (
              <TableRow>
                <TableCell>{t("No schemas found")}</TableCell>
                <TableCell />
                <TableCell />
                <TableCell />
                <TableCell />
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

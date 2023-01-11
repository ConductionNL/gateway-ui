import * as React from "react";
import * as styles from "./CollectionsTemplate.module.css";
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
import { useCollection } from "../../hooks/collection";

export const CollectionsTemplate: React.FC = () => {
  const { t } = useTranslation();

  const queryClient = new QueryClient();
  const _useCollection = useCollection(queryClient);
  const getCollection = _useCollection.getAll();

  return (
    <Container layoutClassName={styles.container}>
      <section className={styles.section}>
        <Heading1>{t("Collections")}</Heading1>
        <div className={styles.buttons}>
          <Button className={styles.buttonIcon} onClick={() => navigate(`/collections/new`)}>
            <FontAwesomeIcon icon={faPlus} />
            {t("Add Collection")}
          </Button>
        </div>
      </section>

      {getCollection.isError && "Error..."}

      {getCollection.isSuccess && (
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>{t("Name")}</TableHeader>
              <TableHeader></TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {getCollection.data.map((collection: any) => (
              <TableRow
                className={styles.tableRow}
                onClick={() => navigate(`/collections/${collection.id}`)}
                key={collection.id}
              >
                <TableCell>{collection.name}</TableCell>
                <TableCell onClick={() => navigate(`/collections/${collection.id}`)}>
                  <Link icon={<ArrowRightIcon />} iconAlign="start">
                    {t("Details")}
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {getCollection.isLoading && <Skeleton height="200px" />}
    </Container>
  );
};

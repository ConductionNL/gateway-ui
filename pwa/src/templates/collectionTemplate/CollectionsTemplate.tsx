import * as React from "react";
import * as styles from "./CollectionsTemplate.module.css";
import { Link } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@gemeente-denhaag/table";
import { useQueryClient } from "react-query";
import { navigate } from "gatsby";
import { Container } from "@conduction/components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faPlus } from "@fortawesome/free-solid-svg-icons";
import Skeleton from "react-loading-skeleton";
import { useCollection } from "../../hooks/collection";
import { Button } from "../../components/button/Button";
import { OverviewPageHeaderTemplate } from "../templateParts/overviewPageHeader/OverviewPageHeaderTemplate";

export const CollectionsTemplate: React.FC = () => {
  const { t } = useTranslation();

  const queryClient = useQueryClient();
  const _useCollection = useCollection(queryClient);
  const getCollection = _useCollection.getAll();

  return (
    <Container layoutClassName={styles.container}>
      <OverviewPageHeaderTemplate
        title={t("Collections")}
        button={
          <Button
            variant="primary"
            label={t("Add Collection")}
            onClick={() => navigate(`/collections/new`)}
            icon={faPlus}
          />
        }
      />

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
                  <Link icon={<FontAwesomeIcon icon={faArrowRight} />} iconAlign="start">
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

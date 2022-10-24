import * as React from "react";
import * as styles from "./DataLayerTemplate.module.css";
import { Button, Heading1, Link } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from "@gemeente-denhaag/table";
import { navigate } from "gatsby";
import { useObject } from "../../hooks/object";
import { QueryClient } from "react-query";
import { Container } from "@conduction/components";
import Skeleton from "react-loading-skeleton";
import { ArrowRightIcon } from "@gemeente-denhaag/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

export const DataLayerTemplate: React.FC = () => {
  const { t } = useTranslation();

  const queryClient = new QueryClient();
  const _useObject = useObject(queryClient);
  const getObject = _useObject.getAll();

  return (
    <Container layoutClassName={styles.container}>
      <section className={styles.section}>
        <Heading1>{t("Data layers")}</Heading1>
        <div className={styles.buttons}>
          <Button className={styles.buttonIcon} onClick={() => navigate(`/datalayers/new`)}>
            <FontAwesomeIcon icon={faPlus} />
            {t("Add")}
          </Button>
        </div>
      </section>

      {getObject.isError && "Error..."}

      {getObject.isSuccess && (
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>{t("Id")}</TableHeader>
              <TableHeader>{t("Type")}</TableHeader>
              <TableHeader>{t("Sources")}</TableHeader>
              <TableHeader></TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {getObject.data.map((object) => (
              <TableRow onClick={() => navigate(`/datalayers/${object.id}`)} key={object.id}>
                <TableCell>{object.id ?? "-"}</TableCell>
                <TableCell>{object.type?.name ?? "-"}</TableCell>
                <TableCell>{object.sources ?? "-"}</TableCell>
                <TableCell onClick={() => navigate(`/datalayers/${object.id}`)}>
                  <Link icon={<ArrowRightIcon />} iconAlign="start">
                    {t("Details")}
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {getObject.isLoading && <Skeleton height="200px" />}
    </Container>
  );
};

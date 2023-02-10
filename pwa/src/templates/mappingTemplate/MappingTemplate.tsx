import * as React from "react";
import * as styles from "./MappingTemplate.module.css";
import { Button, Heading1, Link } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from "@gemeente-denhaag/table";
import { navigate } from "gatsby";
import { Container } from "@conduction/components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { QueryClient } from "react-query";
import { useMapping } from "../../hooks/mapping";
import Skeleton from "react-loading-skeleton";
import { translateDate } from "../../services/dateFormat";
import { ArrowRightIcon } from "@gemeente-denhaag/icons";

export const MappingTemplate: React.FC = () => {
  const { t, i18n } = useTranslation();

  const queryClient = new QueryClient();
  const getMappings = useMapping(queryClient).getAll();

  return (
    <Container layoutClassName={styles.container}>
      <section className={styles.section}>
        <Heading1>{t("Mappings")}</Heading1>
        <div className={styles.buttons}>
          <Button className={styles.buttonIcon} onClick={() => navigate(`/mappings/new`)}>
            <FontAwesomeIcon icon={faPlus} />
            {t("Add Mapping")}
          </Button>
        </div>
      </section>
      {getMappings.isLoading && <Skeleton height="200px" />}

      {getMappings.isSuccess && (
        <Table className={styles.table}>
          <TableHead>
            <TableRow>
              <TableHeader>Name</TableHeader>
              <TableHeader>Version</TableHeader>
              <TableHeader>Date Created</TableHeader>
              <TableHeader>Date Modified</TableHeader>
              <TableHeader></TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {getMappings.data.map((mapping) => (
              <TableRow onClick={() => navigate(`/mappings/${mapping.id}`)} className={styles.tableRow}>
                <TableCell>{mapping.name ?? "-"}</TableCell>
                <TableCell>{mapping.version ?? "-"}</TableCell>
                <TableCell>{translateDate(i18n.language, mapping.dateCreated) ?? "-"}</TableCell>
                <TableCell>{translateDate(i18n.language, mapping.dateModified) ?? "-"}</TableCell>
                <TableCell className={styles.details} onClick={() => navigate(`/mappings/${mapping.id}`)}>
                  <Link icon={<ArrowRightIcon />} iconAlign="start">
                    {t("Details")}
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Container>
  );
};

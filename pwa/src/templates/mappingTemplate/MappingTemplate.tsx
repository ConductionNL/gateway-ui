import * as React from "react";
import * as styles from "./MappingTemplate.module.css";
import { Button, Heading1 } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from "@gemeente-denhaag/table";
import { navigate } from "gatsby";
import { Container } from "@conduction/components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

export const MappingTemplate: React.FC = () => {
  const { t, i18n } = useTranslation();

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

      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>Name</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow onClick={() => navigate(`/mappings/mapping`)}>
            <TableCell>{"name"}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Container>
  );
};

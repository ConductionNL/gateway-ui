import * as React from "react";
import * as styles from "./PluginsTemplate.module.css";
import { Button, Heading1, Link } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@gemeente-denhaag/table";
import { navigate } from "gatsby";
import { Container } from "@conduction/components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { ArrowRightIcon } from "@gemeente-denhaag/icons";
import { TEMPORARY_PLUGINS } from "../../data/plugin";

export const PluginsTemplate: React.FC = () => {
  const { t } = useTranslation();

  const tempPlugin = TEMPORARY_PLUGINS;

  return (
    <Container layoutClassName={styles.container}>
      <section className={styles.section}>
        <Heading1>{t("Plugins")}</Heading1>
        <div className={styles.buttons}>
          <Button className={styles.buttonIcon} onClick={() => navigate(`/plugins/new`)}>
            <FontAwesomeIcon icon={faPlus} />
            {t("Add")}
          </Button>
        </div>
      </section>

      {!tempPlugin && "Error..."}

      {tempPlugin && (
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>{t("Name")}</TableHeader>
              <TableHeader></TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {tempPlugin.map((plugin: any) => (
              <TableRow className={styles.tableRow} onClick={() => navigate(`/plugins/${plugin.id}`)} key={plugin.id}>
                <TableCell>{plugin.name ?? "-"}</TableCell>
                <TableCell onClick={() => navigate(`/plugins/${plugin.id}`)}>
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

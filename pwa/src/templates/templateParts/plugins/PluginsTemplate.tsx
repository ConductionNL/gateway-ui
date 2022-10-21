import * as React from "react";
import * as styles from "./PluginsTemplate.module.css";
import { Button, Heading1, Link } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@gemeente-denhaag/table";
import { QueryClient } from "react-query";
import { navigate } from "gatsby";
import { Container, Tag } from "@conduction/components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Skeleton from "react-loading-skeleton";
import { ArrowRightIcon } from "@gemeente-denhaag/icons";
import clsx from "clsx";

export const PluginsTemplate: React.FC = () => {
  const { t } = useTranslation();

  const queryClient = new QueryClient();
  const _usePlugin = usePlugin(queryClient);
  const getPlugins = _usePlugin.getAll();

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

      {getPlugins.isError && "Error..."}

      {getPlugins.isSuccess && (
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>{t("Name")}</TableHeader>
              <TableHeader>{t("Status")}</TableHeader>
              <TableHeader>{t("Description")}</TableHeader>
              <TableHeader></TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {getPlugins.data.map((plugin: any) => (
              <TableRow className={styles.tableRow} onClick={() => navigate(`/plugins/${plugin.id}`)} key={plugin.id}>
                <TableCell>{plugin.name ?? "-"}</TableCell>
                <TableCell>
                  <div className={clsx(styles[plugin.status === "Ok" ? "statusOk" : "statusFailed"])}>
                    <Tag label={plugin.status?.toString() ?? "-"} />
                  </div>
                </TableCell>
                <TableCell>{plugin.description ?? "-"}</TableCell>
                <TableCell onClick={() => navigate(`/cronjobs/${plugin.id}`)}>
                  <Link className={styles.detailsLink} icon={<ArrowRightIcon />} iconAlign="start">
                    {t("Details")}
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {getPlugins.isLoading && <Skeleton height="200px" />}
    </Container>
  );
};

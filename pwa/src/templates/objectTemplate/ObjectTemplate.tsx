import * as React from "react";
import * as styles from "./ObjectTemplate.module.css";
import { Button, Heading1, Link } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { navigate } from "gatsby";
import { useObject } from "../../hooks/object";
import { QueryClient } from "react-query";
import { Container } from "@conduction/components";
import Skeleton from "react-loading-skeleton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { ObjectsTable } from "../templateParts/objectsTable/ObjectsTable";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@gemeente-denhaag/table";
import clsx from "clsx";
import { ArrowRightIcon } from "@gemeente-denhaag/icons";

export const ObjectTemplate: React.FC = () => {
  const { t } = useTranslation();

  const queryClient = new QueryClient();
  const _useObject = useObject(queryClient);
  const getObject = _useObject.getAll();
  const deleteSchema = _useObject.remove();

  if (getObject.isError) return <>Oops, something went wrong...</>;

  const handleDeleteObject = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.TouchEvent<HTMLButtonElement>,
    objectId: string,
  ) => {
    e.stopPropagation();

    const confirmDeletion = confirm("Are you sure you want to delete this object?");

    if (confirmDeletion) {
      deleteSchema.mutate({ id: objectId });
    }
  };

  return (
    <Container layoutClassName={styles.container}>
      <section className={styles.section}>
        <Heading1>{t("Objects")}</Heading1>
        <div className={styles.buttons}>
          <Button className={styles.buttonIcon} onClick={() => navigate("/objects/new")}>
            <FontAwesomeIcon icon={faPlus} />
            {t("Add Object")}
          </Button>
        </div>
      </section>

      {getObject.isSuccess && (
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>{t("Id")}</TableHeader>
              <TableHeader>{t("Name")}</TableHeader>
              <TableHeader>{t("Schema")}</TableHeader>
              <TableHeader>{t("Sources")}</TableHeader>
              <TableHeader></TableHeader>
              <TableHeader></TableHeader>
            </TableRow>
          </TableHead>

          <TableBody>
            {getObject.data.map((object) => (
              <TableRow onClick={() => navigate(`/objects/${object.id}`)} key={object.id}>
                <TableCell>{object.id ?? "-"}</TableCell>
                <TableCell>{object.name ?? "NVT"}</TableCell>
                <TableCell>{object.entity?.name ?? "-"}</TableCell>
                <TableCell>{object.sources ?? "-"}</TableCell>
                <TableCell>
                  <Button
                    onClick={(e) => handleDeleteObject(e, object.id)}
                    className={clsx(styles.buttonIcon, styles.deleteButton)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                    {t("Delete")}
                  </Button>
                </TableCell>
                <TableCell onClick={() => navigate(`/objects/${object.id}`)}>
                  <Link icon={<ArrowRightIcon />} iconAlign="start">
                    {t("Details")}
                  </Link>
                </TableCell>
              </TableRow>
            ))}

            {!getObject.data.length && (
              <TableRow>
                <TableCell>{t("No objects found")}</TableCell>
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
      {getObject.isLoading && <Skeleton height="200px" />}
    </Container>
  );
};

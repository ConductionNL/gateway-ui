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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@gemeente-denhaag/table";
import clsx from "clsx";
import { ArrowRightIcon } from "@gemeente-denhaag/icons";
import { FiltersContext } from "../../context/filters";
import { PaginatedItems } from "../../components/pagination/pagination";
import { GatsbyContext } from "../../context/gatsby";

export const ObjectTemplate: React.FC = () => {
  const { t } = useTranslation();
  const [filters, setFilters] = React.useContext(FiltersContext);
  const { screenSize } = React.useContext(GatsbyContext);
  const [marginPagesDisplayed, setMarginPageDisplayed] = React.useState<number>(3);

  const queryClient = new QueryClient();
  const _useObject = useObject(queryClient);
  const getObject = _useObject.getAll({ ...filters }, 30);
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

  React.useEffect(() => {
    if (getObject.isSuccess && screenSize === "mobile") {
      setMarginPageDisplayed(2);
    }
    if (getObject.isSuccess && screenSize === "mobile" && getObject.data.pages > 100) {
      setMarginPageDisplayed(1);
    }
    if (getObject.isSuccess && screenSize !== "mobile") {
      setMarginPageDisplayed(3);
    }
  }, [getObject]);

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
        <>
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
              {!!getObject.data.results.length &&
                getObject.data.results.map((object: any) => (
                  <TableRow onClick={() => navigate(`/objects/${object.id}`)} key={object.id}>
                    <TableCell>{object._self?.id ?? "-"}</TableCell>
                    <TableCell>{object._self?.name ?? "NVT"}</TableCell>
                    <TableCell>{object._self?.schema?.id ?? "-"}</TableCell>
                    <TableCell>{object._self?.sources ?? "-"}</TableCell>
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

              {!getObject.data.results.length && (
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
          {getObject.data.results.length && (
            <PaginatedItems
              pages={getObject.data.pages}
              currentPage={getObject.data.page}
              setPage={(page) => setFilters({ ...filters, objectCurrentPage: page })}
              pageRangeDisplayed={2}
              marginPagesDisplayed={marginPagesDisplayed}
              containerClassName={styles.paginationContainer}
              pageClassName={getObject.data.pages > 1000 ? styles.paginationLinkSmall : styles.paginationLink}
              previousClassName={getObject.data.pages > 1000 ? styles.paginationLinkSmall : styles.paginationLink}
              nextClassName={getObject.data.pages > 1000 ? styles.paginationLinkSmall : styles.paginationLink}
              activeClassName={
                getObject.data.pages > 1000 ? styles.paginationActivePageSmall : styles.paginationActivePage
              }
              disabledClassName={styles.paginationDisabled}
              breakClassName={styles.breakLink}
            />
          )}
        </>
      )}
      {getObject.isLoading && <Skeleton height="200px" />}
    </Container>
  );
};

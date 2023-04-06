import * as React from "react";
import * as styles from "./ObjectsTable.module.css";
import { navigate } from "gatsby";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@gemeente-denhaag/table";
import { Link } from "@gemeente-denhaag/components-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faSearch } from "@fortawesome/free-solid-svg-icons";
import { useObject } from "../../../hooks/object";
import { UseQueryResult } from "react-query";
import { Paginate } from "../../../components/paginate/Paginate";
import { useTranslation } from "react-i18next";
import { useBulkSelect } from "../../../hooks/useBulkSelect";
import { BulkActionButton } from "../../../components/bulkActionButton/BulkActionButton";
import Skeleton from "react-loading-skeleton";
import { InputText } from "@conduction/components";
import { useForm } from "react-hook-form";

interface TableProps {
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
}

/**
 * Entry point
 * Hold logic for pagination, and search queries
 */
export const ObjectsTableTemplate: React.FC<{ entityId?: string }> = ({ entityId }) => {
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [currentPage, setCurrentPage] = React.useState<number>(1);

  if (entityId) {
    return <ObjectsFromEntityTable {...{ entityId, currentPage, setCurrentPage, searchQuery, setSearchQuery }} />;
  }

  return <ObjectsTable {...{ currentPage, setCurrentPage, searchQuery, setSearchQuery }} />;
};

/**
 * Objects from specific Entity
 * Holds and manages query to get all objects from entity
 */
const ObjectsFromEntityTable: React.FC<{ entityId: string } & TableProps> = ({
  entityId,
  currentPage,
  searchQuery,
  ...rest
}) => {
  const getAllObjectsFromEntity = useObject().getAllFromEntity(entityId, currentPage, searchQuery);

  return <BaseTable objectsQuery={getAllObjectsFromEntity} {...{ currentPage, searchQuery, ...rest }} />;
};

/**
 * All objects
 * Holds and manages query to get all objects
 */
const ObjectsTable: React.FC<TableProps> = ({ currentPage, searchQuery, ...rest }) => {
  const getObjects = useObject().getAll(currentPage, undefined, searchQuery);

  return <BaseTable objectsQuery={getObjects} {...{ currentPage, searchQuery, ...rest }} />;
};

/**
 * Table to show actual objects
 */
const BaseTable: React.FC<{ objectsQuery: UseQueryResult<any, Error> } & TableProps> = ({
  objectsQuery,
  currentPage,
  setCurrentPage,
  searchQuery,
  setSearchQuery,
}) => {
  const searchQueryTimeout = React.useRef<NodeJS.Timeout | null>(null);
  const { t } = useTranslation();

  const {
    watch,
    register,
    formState: { errors },
  } = useForm();

  const watchSearchQuery = watch("searchQuery");

  React.useEffect(() => {
    if (searchQueryTimeout.current) clearTimeout(searchQueryTimeout.current);

    searchQueryTimeout.current = setTimeout(() => setSearchQuery(watchSearchQuery), 500);
  }, [watchSearchQuery]);

  const deleteObject = useObject().remove();

  const { CheckboxBulkSelectAll, CheckboxBulkSelectOne, selectedItems } = useBulkSelect(objectsQuery);

  const handleBulkDelete = () => {
    selectedItems.forEach((item) => deleteObject.mutate({ id: item }));
  };

  return (
    <div className={styles.container}>
      <div className={styles.actionsContainer}>
        <div className={styles.searchActionContainer}>
          <InputText
            icon={<FontAwesomeIcon icon={faSearch} />}
            name="searchQuery"
            placeholder="Type to search..."
            defaultValue={searchQuery}
            {...{ register, errors }}
          />
        </div>

        <BulkActionButton
          actions={[{ type: "delete", onSubmit: handleBulkDelete }]}
          selectedItemsCount={selectedItems.length}
        />
      </div>

      {objectsQuery.isLoading && <Skeleton height="200px" />}

      {objectsQuery.isSuccess && (
        <>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>
                  <CheckboxBulkSelectAll />
                </TableHeader>
                <TableHeader>{t("Id")}</TableHeader>
                <TableHeader>{t("Name")}</TableHeader>
                <TableHeader>{t("Schema")}</TableHeader>
                <TableHeader></TableHeader>
              </TableRow>
            </TableHead>

            <TableBody>
              {objectsQuery.isSuccess &&
                objectsQuery.data.results.map((object: any) => (
                  <TableRow key={object._self.id}>
                    <TableCell>{<CheckboxBulkSelectOne id={object.id} />}</TableCell>
                    <TableCell>{object._self.id ?? "-"}</TableCell>
                    <TableCell>{object._self.name ?? "NVT"}</TableCell>
                    <TableCell>{object._self?.schema?.id ?? "-"}</TableCell>
                    <TableCell onClick={() => navigate(`/objects/${object._self.id}`)}>
                      <Link icon={<FontAwesomeIcon icon={faArrowRight} />} iconAlign="start">
                        {t("Details")}
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}

              {!objectsQuery.data.results.length && (
                <TableRow>
                  <TableCell>{t("No objects found")}</TableCell>
                  <TableCell />
                  <TableCell />
                  <TableCell />
                  <TableCell />
                </TableRow>
              )}
            </TableBody>
          </Table>

          <Paginate totalPages={objectsQuery.data.pages} currentPage={currentPage} changePage={setCurrentPage} />
        </>
      )}
    </div>
  );
};

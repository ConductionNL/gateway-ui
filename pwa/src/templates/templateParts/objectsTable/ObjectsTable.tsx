import * as React from "react";
import * as styles from "./ObjectsTable.module.css";
import { navigate } from "gatsby";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@gemeente-denhaag/table";
import { Link } from "@gemeente-denhaag/components-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faSearch } from "@fortawesome/free-solid-svg-icons";
import { useObject } from "../../../hooks/object";
import { UseQueryResult } from "react-query";
import { useTranslation } from "react-i18next";
import { useBulkSelect } from "../../../hooks/useBulkSelect";
import { BulkActionButton } from "../../../components/bulkActionButton/BulkActionButton";
import { InputText } from "@conduction/components";
import { useForm } from "react-hook-form";
import { DisplayFilters } from "../displayFilters/DisplayFilters";
import { useTableColumnsContext } from "../../../context/tableColumns";
import { useObjectsStateContext } from "../../../context/objects";
import { ActionButton } from "../../../components/actionButton/ActionButton";
import { usePagination } from "../../../hooks/usePagination";
import Skeleton from "react-loading-skeleton";

interface ObjectsTableProps {
  objectsQuery: UseQueryResult<any, Error>;
  pagination: {
    currentPage: number;
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  };
  search: {
    searchQuery: string;
    setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  };
}

export const ObjectsTable: React.FC<ObjectsTableProps> = ({
  objectsQuery,
  pagination,
  search: { searchQuery, setSearchQuery },
}) => {
  const {
    columns: { objectColumns },
    setColumns,
  } = useTableColumnsContext();
  const { toggleOrder, objectsState, setObjectsState } = useObjectsStateContext();
  const { Pagination, PaginationLocationIndicator, PaginationLimitSelect } = usePagination(
    { ...objectsQuery.data },
    pagination.currentPage,
    pagination.setCurrentPage,
  );
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

  const { CheckboxBulkSelectAll, CheckboxBulkSelectOne, selectedItems, toggleItem } = useBulkSelect(objectsQuery);

  const handleBulkDelete = () => {
    selectedItems.forEach((item) => deleteObject.mutate({ id: item }));
  };

  const handleDuplicate = (objectId: string) => {
    setObjectsState({ inDuplicatingMode: true });
    navigate(`/objects/${objectId}`);
  };

  const handleNavigateToDetail = (objectId: string) => {
    setObjectsState({ inDuplicatingMode: false });
    navigate(`/objects/${objectId}`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.actionsContainer}>
        <div className={styles.searchAndFilterContainer}>
          <DisplayFilters
            sortOrder={objectsState.order}
            columnType="objectColumns"
            toggleSortOrder={toggleOrder}
            disabled={objectsQuery.isLoading}
            tableColumns={objectColumns}
            setTableColumns={setColumns}
          />

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
          <div className={styles.pageAndTotalResults}>
            {objectsQuery.data.results && <PaginationLocationIndicator />}
          </div>

          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>
                  <CheckboxBulkSelectAll />
                </TableHeader>
                {objectColumns.id && <TableHeader>{t("Id")}</TableHeader>}
                {objectColumns.name && <TableHeader>{t("Name")}</TableHeader>}
                {objectColumns.schema && <TableHeader>{t("Schema")}</TableHeader>}
                {objectColumns.actions && <TableHeader>Actions</TableHeader>}
                <TableHeader></TableHeader>
              </TableRow>
            </TableHead>

            <TableBody>
              {objectsQuery.data.results &&
                objectsQuery.data.results.map((object: any) => (
                  <TableRow key={object._self.id} onClick={() => toggleItem(object._self.id)}>
                    <TableCell>{<CheckboxBulkSelectOne id={object._self.id} />}</TableCell>

                    {objectColumns.id && <TableCell>{object._self.id}</TableCell>}

                    {objectColumns.name && (
                      <TableCell>
                        <span onClick={() => handleNavigateToDetail(object._self.id)}>
                          <Link icon={<FontAwesomeIcon icon={faArrowRight} />} iconAlign="start">
                            {object.name ?? "-"}
                          </Link>
                        </span>
                      </TableCell>
                    )}

                    {objectColumns.schema && (
                      <TableCell>
                        <span onClick={() => navigate(`/schemas/${object._self?.schema?.id}`)}>
                          <Link icon={<FontAwesomeIcon icon={faArrowRight} />} iconAlign="start">
                            {object._self?.schema?.name ?? "-"}
                          </Link>
                        </span>
                      </TableCell>
                    )}

                    {objectColumns.actions && (
                      <TableCell>
                        <ActionButton
                          actions={[
                            { type: "delete", onSubmit: () => deleteObject.mutate({ id: object._self.id }) },
                            { type: "duplicate", onSubmit: () => handleDuplicate(object._self.id) },
                            { type: "download", onSubmit: () => undefined, disabled: true },
                          ]}
                          variant="secondary"
                        />
                      </TableCell>
                    )}

                    <TableCell onClick={() => handleNavigateToDetail(object._self.id)}>
                      <Link icon={<FontAwesomeIcon icon={faArrowRight} />} iconAlign="start">
                        {t("Details")}
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}

              {(!objectsQuery.data.results || !objectsQuery.data.results.length) && (
                <TableRow>
                  <TableCell>No objects found</TableCell>
                  <TableCell />
                  {Object.values(objectColumns)
                    .filter((value) => value)
                    .map((_, idx) => (
                      <TableCell key={idx} />
                    ))}
                </TableRow>
              )}
            </TableBody>
          </Table>

          {objectsQuery.data.results && (
            <div className={styles.pagination}>
              <Pagination />
              <PaginationLimitSelect queryLimitName={"objectsQueryLimit"} />
            </div>
          )}
        </>
      )}
    </div>
  );
};

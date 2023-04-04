import * as React from "react";
import * as styles from "./ObjectTemplate.module.css";
import { useTranslation } from "react-i18next";
import { navigate } from "gatsby";
import { useObject } from "../../hooks/object";
import { useQueryClient } from "react-query";
import { Container } from "@conduction/components";
import Skeleton from "react-loading-skeleton";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { Button } from "../../components/button/Button";
import { OverviewPageHeaderTemplate } from "../templateParts/overviewPageHeader/OverviewPageHeaderTemplate";
import { ObjectsTable } from "../templateParts/objectsTable/ObjectsTable";

export const ObjectTemplate: React.FC = () => {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = React.useState<number>(1);

  const queryClient = useQueryClient();
  const _useObject = useObject(queryClient);
  const getObjects = _useObject.getAll(currentPage, 30);

  if (getObjects.isError) return <>Oops, something went wrong...</>;

  return (
    <Container layoutClassName={styles.container}>
      <OverviewPageHeaderTemplate
        title={t("Objects")}
        button={
          <Button variant="primary" icon={faPlus} label={t("Add Object")} onClick={() => navigate("/objects/new")} />
        }
      />

      {getObjects.isSuccess && (
        <div>
          <ObjectsTable
            objects={getObjects.data.results}
            pagination={{
              totalPages: getObjects.data.pages,
              currentPage: currentPage,
              changePage: setCurrentPage,
            }}
          />
        </div>
      )}
      {getObjects.isLoading && <Skeleton height="200px" />}
    </Container>
  );
};

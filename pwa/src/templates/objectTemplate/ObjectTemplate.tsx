import * as React from "react";
import * as styles from "./ObjectTemplate.module.css";
import { useTranslation } from "react-i18next";
import { navigate } from "gatsby";
import { Container } from "@conduction/components";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { Button } from "../../components/button/Button";
import { OverviewPageHeaderTemplate } from "../templateParts/overviewPageHeader/OverviewPageHeaderTemplate";
import { ObjectsTable } from "../templateParts/objectsTable/ObjectsTable";
import { useObject } from "../../hooks/object";
import { useObjectsStateContext } from "../../context/objects";
import { useQueryLimitContext } from "../../context/queryLimit";

export const ObjectTemplate: React.FC = () => {
  const { t } = useTranslation();
  const { objectsState } = useObjectsStateContext();
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const { queryLimit } = useQueryLimitContext();

  const getObjects = useObject().getAll(currentPage, objectsState.order, queryLimit.objectsQueryLimit, searchQuery);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [queryLimit.objectsQueryLimit]);

  return (
    <Container layoutClassName={styles.container}>
      <OverviewPageHeaderTemplate
        title={t("Objects")}
        button={
          <Button variant="primary" icon={faPlus} label={t("Add Object")} onClick={() => navigate("/objects/new")} />
        }
      />

      <ObjectsTable
        objectsQuery={getObjects}
        pagination={{
          currentPage,
          setCurrentPage,
        }}
        search={{ searchQuery, setSearchQuery }}
      />
    </Container>
  );
};

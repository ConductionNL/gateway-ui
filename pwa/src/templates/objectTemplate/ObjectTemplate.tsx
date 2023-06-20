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
import { usePaginationContext } from "../../context/pagination";

const PAGINATION_KEY = "objects";

export const ObjectTemplate: React.FC = () => {
  const { t } = useTranslation();
  const { objectsState } = useObjectsStateContext();
  const [searchQuery, setSearchQuery] = React.useState<string>("");

  const { getCurrentPage, getPerPage } = usePaginationContext();

  const getObjects = useObject().getAll(
    getCurrentPage(PAGINATION_KEY),
    objectsState.order,
    getPerPage(PAGINATION_KEY),
    searchQuery,
  );

  return (
    <Container layoutClassName={styles.container}>
      <OverviewPageHeaderTemplate
        title={t("Objects")}
        button={
          <Button variant="primary" icon={faPlus} label={t("Add Object")} onClick={() => navigate("/objects/new")} />
        }
      />

      <ObjectsTable objectsQuery={getObjects} search={{ searchQuery, setSearchQuery }} paginationKey={PAGINATION_KEY} />
    </Container>
  );
};

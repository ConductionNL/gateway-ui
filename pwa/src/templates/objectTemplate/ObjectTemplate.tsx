import * as React from "react";
import * as styles from "./ObjectTemplate.module.css";
import { Button, Heading1 } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { navigate } from "gatsby";
import { useObject } from "../../hooks/object";
import { QueryClient } from "react-query";
import { Container } from "@conduction/components";
import Skeleton from "react-loading-skeleton";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { ObjectsTable } from "../templateParts/objectsTable/ObjectsTable";
import { PaginatedItems } from "../../components/pagination/pagination";
import { GatsbyContext } from "../../context/gatsby";

export const ObjectTemplate: React.FC = () => {
  const { t } = useTranslation();
  const { screenSize } = React.useContext(GatsbyContext);
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const [marginPagesDisplayed, setMarginPageDisplayed] = React.useState<number>(5);

  const queryClient = new QueryClient();
  const _useObject = useObject(queryClient);
  const getObject = _useObject.getAll(currentPage);

  if (getObject.isError) return <>Oops, something went wrong...</>;

  React.useEffect(() => {
    if (getObject.isSuccess && screenSize === "mobile") {
      setMarginPageDisplayed(3);
    }
    // if (getObject.isSuccess && screenSize === "mobile" && getObject.data.pages > 100) {
    //   setMarginPageDisplayed(2);
    // }
    if (getObject.isSuccess && screenSize !== "mobile") {
      setMarginPageDisplayed(5);
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

      {getObject.isSuccess && <ObjectsTable objects={getObject.data} />}

      {getObject.isSuccess && !!getObject.data && (
        <PaginatedItems
          pages={10}
          currentPage={currentPage}
          setPage={setCurrentPage}
          pageRangeDisplayed={2}
          marginPagesDisplayed={marginPagesDisplayed}
        />
      )}

      {getObject.isLoading && <Skeleton height="200px" />}
    </Container>
  );
};

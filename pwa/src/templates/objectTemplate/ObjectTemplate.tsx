import * as React from "react";
import * as styles from "./ObjectTemplate.module.css";
import { useTranslation } from "react-i18next";
import { navigate } from "gatsby";
import { Container } from "@conduction/components";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { Button } from "../../components/button/Button";
import { OverviewPageHeaderTemplate } from "../templateParts/overviewPageHeader/OverviewPageHeaderTemplate";
import { ObjectsTableTemplate } from "../templateParts/objectsTable/ObjectsTable";

export const ObjectTemplate: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Container layoutClassName={styles.container}>
      <OverviewPageHeaderTemplate
        title={t("Objects")}
        button={
          <Button variant="primary" icon={faPlus} label={t("Add Object")} onClick={() => navigate("/objects/new")} />
        }
      />

      <ObjectsTableTemplate />
    </Container>
  );
};

import * as React from "react";
import * as styles from "./CreateDatabaseTemplate.module.css";
import { formId, DatabaseFormTemplate } from "./DatabaseFormTemplate";
import { useTranslation } from "react-i18next";
import { Container } from "@conduction/components";
import { useIsLoadingContext } from "../../../context/isLoading";
import { FormHeaderTemplate } from "../formHeader/FormHeaderTemplate";

export const CreateDatabaseTemplate: React.FC = () => {
  const { t } = useTranslation();
  const { isLoading } = useIsLoadingContext();

  return (
    <Container layoutClassName={styles.container}>
      <FormHeaderTemplate title={t("Create Database")} {...{ formId }} disabled={isLoading.userForm} />

      <DatabaseFormTemplate />
    </Container>
  );
};

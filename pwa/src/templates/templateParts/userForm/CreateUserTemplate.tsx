import * as React from "react";
import * as styles from "./CreateUserTemplate.module.css";
import { formId, UserFormTemplate } from "./UserFormTemplate";
import { useTranslation } from "react-i18next";
import { Container } from "@conduction/components";
import { IsLoadingContext } from "../../../context/isLoading";
import { FormHeaderTemplate } from "../formHeader/FormHeaderTemplate";

export const CreateUserTemplate: React.FC = () => {
  const { t } = useTranslation();
  const [isLoading] = React.useContext(IsLoadingContext);

  return (
    <Container layoutClassName={styles.container}>
      <FormHeaderTemplate title={t("Create User")} {...{ formId }} disabled={isLoading.userForm} />

      <UserFormTemplate />
    </Container>
  );
};

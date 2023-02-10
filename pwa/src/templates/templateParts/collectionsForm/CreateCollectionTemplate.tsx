import * as React from "react";
import * as styles from "./CreateCollectionTemplate.module.css";
import { useTranslation } from "react-i18next";
import { useIsLoading } from "../../../context/isLoading";
import { CollectionFormTemplate, formId } from "./CollectionFormTemplate";
import { FormHeaderTemplate } from "../formHeader/FormHeaderTemplate";

export const CreateCollectionTemplate: React.FC = () => {
  const { t } = useTranslation();
  const { isLoading } = useIsLoading();

  return (
    <div className={styles.container}>
      <FormHeaderTemplate title={t("Create Collection")} {...{ formId }} disabled={isLoading.collectionForm} />

      <CollectionFormTemplate />
    </div>
  );
};

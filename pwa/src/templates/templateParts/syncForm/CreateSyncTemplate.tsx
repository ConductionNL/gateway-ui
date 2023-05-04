import * as React from "react";
import * as styles from "./SyncFormTemplate.module.css";

import { useTranslation } from "react-i18next";
import { SyncFormTemplate, formId } from "./SyncFormTemplate";
import { useIsLoadingContext } from "../../../context/isLoading";
import { FormHeaderTemplate } from "../formHeader/FormHeaderTemplate";

interface CreateSyncTemplateProps {
  objectId: string;
}

export const CreateSyncTemplate: React.FC<CreateSyncTemplateProps> = ({ objectId }) => {
  const { t } = useTranslation();
  const { isLoading } = useIsLoadingContext();

  return (
    <div className={styles.container}>
      <FormHeaderTemplate title={t("Create Sync")} disabled={isLoading.sourceForm} {...{ formId }} />

      <SyncFormTemplate {...{ objectId }} />
    </div>
  );
};

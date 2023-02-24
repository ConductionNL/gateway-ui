import * as React from "react";
import * as styles from "./ApplicationTemplate.module.css";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "react-query";
import { useApplication } from "../../hooks/application";
import { ApplicationsFormTemplate, formId } from "../templateParts/applicationsForm/ApplicationsFormTemplate";
import Skeleton from "react-loading-skeleton";
import { useIsLoadingContext } from "../../context/isLoading";
import { FormHeaderTemplate } from "../templateParts/formHeader/FormHeaderTemplate";

interface EditApplicationTemplateProps {
  applicationId: string;
}

export const EditApplicationTemplate: React.FC<EditApplicationTemplateProps> = ({ applicationId }) => {
  const { t } = useTranslation();
  const { setIsLoading, isLoading } = useIsLoadingContext();

  const queryClient = useQueryClient();
  const _useApplication = useApplication(queryClient);
  const getApplication = _useApplication.getOne(applicationId);
  const deleteApplication = _useApplication.remove();

  React.useEffect(() => {
    setIsLoading({ applicationForm: deleteApplication.isLoading });
  }, [deleteApplication.isLoading]);

  return (
    <div className={styles.container}>
      {getApplication.isSuccess && (
        <>
          <FormHeaderTemplate
            title={`Edit ${getApplication.data.name}`}
            {...{ formId }}
            disabled={isLoading.applicationForm}
            handleDelete={() => deleteApplication.mutate({ id: applicationId })}
            showTitleTooltip
          />

          <ApplicationsFormTemplate application={getApplication.data} />
        </>
      )}

      {getApplication.isLoading && <Skeleton height={200} />}
    </div>
  );
};

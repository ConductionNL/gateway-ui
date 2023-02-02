import * as React from "react";
import * as styles from "./ApplicationTemplate.module.css";
import { Button, Heading1 } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useQueryClient } from "react-query";
import clsx from "clsx";
import { useApplication } from "../../hooks/application";
import { ApplicationsFormTemplate, formId } from "../templateParts/applicationsForm/ApplicationsFormTemplate";
import Skeleton from "react-loading-skeleton";
import { IsLoadingContext } from "../../context/isLoading";

interface EditApplicationTemplateProps {
  applicationId: string;
}

export const EditApplicationTemplate: React.FC<EditApplicationTemplateProps> = ({ applicationId }) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = React.useContext(IsLoadingContext);

  const queryClient = useQueryClient();
  const _useApplication = useApplication(queryClient);
  const getApplication = _useApplication.getOne(applicationId);
  const deleteApplication = _useApplication.remove();

  const handleDeleteApplication = () => {
    const confirmDeletion = confirm("Are you sure you want to delete this application?");

    confirmDeletion && deleteApplication.mutate({ id: applicationId });
  };

  React.useEffect(() => {
    setIsLoading({ ...isLoading, applicationForm: deleteApplication.isLoading });
  }, [deleteApplication.isLoading]);

  return (
    <div className={styles.container}>
      {getApplication.isSuccess && (
        <>
          <section className={styles.section}>
            <Heading1>{`Edit ${getApplication.data.name}`}</Heading1>

            <div className={styles.buttons}>
              <Button
                type="submit"
                form={formId}
                disabled={isLoading.applicationForm}
                className={clsx(styles.buttonIcon, styles.button)}
              >
                <FontAwesomeIcon icon={faFloppyDisk} />
                {t("Save")}
              </Button>

              <Button
                onClick={handleDeleteApplication}
                disabled={isLoading.applicationForm}
                className={clsx(styles.buttonIcon, styles.button, styles.deleteButton)}
              >
                <FontAwesomeIcon icon={faTrash} />
                {t("Delete")}
              </Button>
            </div>
          </section>

          <ApplicationsFormTemplate application={getApplication.data} />
        </>
      )}

      {getApplication.isLoading && <Skeleton height={200} />}
    </div>
  );
};

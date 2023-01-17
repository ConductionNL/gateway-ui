import * as React from "react";
import * as styles from "./ApplicationTemplate.module.css";
import { Button, Heading1 } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { useQueryClient } from "react-query";
import clsx from "clsx";
import { useApplication } from "../../hooks/application";
import { ApplicationsFormTemplate } from "../templateParts/applicationsForm/ApplicationsFormTemplate";

interface EditApplicationTemplateProps {
  applicationId: string;
}

export const EditApplicationTemplate: React.FC<EditApplicationTemplateProps> = ({ applicationId }) => {
  const { t } = useTranslation();

  const [loading, setLoading] = React.useState<boolean>(false);

  const queryClient = useQueryClient();
  const _useApplication = useApplication(queryClient);
  const getApplication = _useApplication.getOne(applicationId);
  const deleteApplication = _useApplication.remove();

  const handleDeleteApplication = () => {
    const confirmDeletion = confirm("Are you sure you want to delete this application?");

    if (confirmDeletion) {
      deleteApplication.mutate({ id: applicationId });
    }
  };

  return (
    <div className={styles.container}>
      {getApplication.isSuccess && (
        <>
          <section className={styles.section}>
            <Heading1>{`Edit ${getApplication.data.name}`}</Heading1>

            <div className={styles.buttons}>
              <Button
                onClick={handleDeleteApplication}
                className={clsx(styles.buttonIcon, styles.deleteButton)}
                disabled={loading}
              >
                <FontAwesomeIcon icon={faTrash} />
                {t("Delete")}
              </Button>
            </div>
          </section>
          <ApplicationsFormTemplate application={getApplication.data} />
        </>
      )}
    </div>
  );
};

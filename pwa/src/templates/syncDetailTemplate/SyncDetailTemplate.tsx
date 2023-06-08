import * as React from "react";
import * as styles from "./SyncDetailTemplate.module.css";
import { Link } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "react-query";
import { Container } from "@conduction/components";
import Skeleton from "react-loading-skeleton";
import { SyncFormTemplate, formId } from "../templateParts/syncForm/SyncFormTemplate";
import { useSync } from "../../hooks/synchronization";
import { navigate } from "gatsby";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FormHeaderTemplate } from "../templateParts/formHeader/FormHeaderTemplate";
import { useIsLoadingContext } from "../../context/isLoading";

interface SyncDetailTemplateProps {
  syncId: string;
  objectId: string;
}

export const SyncDetailTemplate: React.FC<SyncDetailTemplateProps> = ({ syncId, objectId }) => {
  const { t } = useTranslation();
  const { setIsLoading, isLoading } = useIsLoadingContext();

  const queryClient = useQueryClient();
  const _useSync = useSync(queryClient);
  const getSynchronization = _useSync.getOne(syncId);
  const deleteSync = _useSync.remove(objectId);

  React.useEffect(() => {
    setIsLoading({ syncForm: deleteSync.isLoading });
  }, [deleteSync.isLoading]);

  return (
    <Container layoutClassName={styles.container}>
      <div onClick={() => navigate(`/objects/${objectId}`)}>
        <Link icon={<FontAwesomeIcon icon={faArrowLeft} />} iconAlign="start">
          {t("Back to object")}
        </Link>
      </div>
      {getSynchronization.isError && "Error..."}

      {getSynchronization.isSuccess && (
        <>
          <FormHeaderTemplate
            {...{ formId }}
            disabled={isLoading.syncForm}
            title={`Edit ${getSynchronization.data.id}`}
            handleDelete={() => deleteSync.mutateAsync({ id: syncId })}
            showTitleTooltip
          />
          <SyncFormTemplate synchronization={getSynchronization.data} {...{ objectId }} />
        </>
      )}

      {getSynchronization.isLoading && <Skeleton height="200px" />}
    </Container>
  );
};

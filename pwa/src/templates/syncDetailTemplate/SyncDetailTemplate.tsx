import * as React from "react";
import * as styles from "./SyncDetailTemplate.module.css";
import { Link } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "react-query";
import { Container } from "@conduction/components";
import Skeleton from "react-loading-skeleton";
import { EditSyncFormTemplate } from "../templateParts/syncForm/EditSyncFormTemplate";
import { useSync } from "../../hooks/synchronization";
import { navigate } from "gatsby";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface SyncDetailTemplateProps {
  syncId: string;
  objectId: string;
}

export const SyncDetailTemplate: React.FC<SyncDetailTemplateProps> = ({ syncId, objectId }) => {
  const { t } = useTranslation();

  const queryClient = useQueryClient();
  const _useSync = useSync(queryClient);
  const getSynchronization = _useSync.getOne(syncId);

  return (
    <Container layoutClassName={styles.container}>
      <div onClick={() => navigate(`/objects/${objectId}`)}>
        <Link icon={<FontAwesomeIcon icon={faArrowLeft} />} iconAlign="start">
          {t("Back to object")}
        </Link>
      </div>
      {getSynchronization.isError && "Error..."}

      {getSynchronization.isSuccess && (
        <EditSyncFormTemplate sync={getSynchronization.data} {...{ syncId, objectId }} />
      )}

      {getSynchronization.isLoading && <Skeleton height="200px" />}
    </Container>
  );
};

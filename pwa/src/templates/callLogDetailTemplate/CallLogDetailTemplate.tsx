import * as React from "react";
import * as styles from "./CallLogDetailTemplate.module.css";
import { Heading1, Link } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { navigate } from "gatsby";
import { QueryClient } from "react-query";
import _ from "lodash";
import { ArrowLeftIcon } from "@gemeente-denhaag/icons";
import Skeleton from "react-loading-skeleton";
import { useCallLog } from "../../hooks/callLog";

interface CallLogDetailTemplateProps {
  calllogId: string;
  sourceId: string;
}

export const CallLogDetailTemplate: React.FC<CallLogDetailTemplateProps> = ({ calllogId, sourceId }) => {
  const { t, i18n } = useTranslation();

  const queryClient = new QueryClient();
  const _useCallLogs = useCallLog(queryClient);
  const _getCallLog = _useCallLogs.getOne(calllogId);

  return (
    <div className={styles.container}>
      <div onClick={() => navigate(`/sources/${sourceId}`)}>
        <Link icon={<ArrowLeftIcon />} iconAlign="start">
          {t("Back to source")}
        </Link>
      </div>
      <section className={styles.section}>
        <Heading1>{t("CallLog")}</Heading1>
      </section>

      {_getCallLog.isError && "Error..."}

      {_getCallLog.isSuccess && (
        <div>
          <div>Id - {_getCallLog.data.id ?? "-"}</div>
          <div>Source - {_getCallLog.data.source.name ?? "-"}</div>
          <div>Endpoint - {_getCallLog.data.endpoint ?? "-"}</div>
          <div>Config - {"-"}</div>
          <div>Method - {_getCallLog.data.method ?? "-"}</div>
          <div>Response Status - {_getCallLog.data.responseStatus ?? "-"}</div>
          <div>Response Status Code - {_getCallLog.data.responseStatusCode ?? "-"}</div>
          <div>Response Body - {_getCallLog.data.responseBody ?? "-"}</div>
          <div>Date Created - {_getCallLog.data.dateCreated ?? "-"}</div>
          <div>Date Modified - {_getCallLog.data.dateModified ?? "-"}</div>
        </div>
      )}

      {_getCallLog.isLoading && <Skeleton height="200px" />}
    </div>
  );
};

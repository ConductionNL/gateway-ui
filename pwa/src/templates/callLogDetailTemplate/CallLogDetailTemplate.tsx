import * as React from "react";
import * as styles from "./CallLogDetailTemplate.module.css";
import { Heading1, Heading3, Link } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { navigate } from "gatsby";
import { QueryClient } from "react-query";
import _ from "lodash";
import { ArrowLeftIcon } from "@gemeente-denhaag/icons";
import Skeleton from "react-loading-skeleton";
import { useCallLog } from "../../hooks/callLog";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@gemeente-denhaag/table";
import { dateTime } from "../../services/dateTime";
import clsx from "clsx";
import { Tag } from "@conduction/components";
import { getStatusColor, getStatusIcon } from "../../services/getStatusColorAndIcon";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
          <Table>
            <TableBody>
              <TableRow>
                <TableHeader>Id</TableHeader>
                <TableCell>{_getCallLog.data.id ?? "-"}</TableCell>
              </TableRow>
              <TableRow>
                <TableHeader>Source</TableHeader>
                <TableCell>{_getCallLog.data.source.name ?? "-"}</TableCell>
              </TableRow>
              <TableRow>
                <TableHeader>Endpoint</TableHeader>
                <TableCell>{_getCallLog.data.endpoint ?? "-"}</TableCell>
              </TableRow>
              <TableRow>
                <TableHeader>Config</TableHeader>
                <TableCell>{"-"}</TableCell>
              </TableRow>
              <TableRow>
                <TableHeader>Method</TableHeader>
                <TableCell>
                  <div className={clsx(styles[`${_.lowerCase(_getCallLog.data.method)}Tag`])}>
                    <Tag label={_getCallLog.data.method?.toString() ?? "no known method"} />
                  </div>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableHeader>Response Status</TableHeader>
                <TableCell>{_getCallLog.data.responseStatus || "-"}</TableCell>
              </TableRow>
              <TableRow>
                <TableHeader>Response Status Code</TableHeader>
                <TableCell>
                  <div
                    className={clsx(
                      styles[getStatusColor(_getCallLog.data.responseStatusCode.toString() ?? "no known status")],
                    )}
                  >
                    <Tag
                      icon={
                        <FontAwesomeIcon
                          icon={getStatusIcon(_getCallLog.data.responseStatusCode.toString() ?? "no known status")}
                        />
                      }
                      label={_getCallLog.data.responseStatusCode?.toString() ?? "no known status"}
                    />
                  </div>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableHeader>Date Created</TableHeader>
                <TableCell>{dateTime(t(i18n.language),_getCallLog.data.dateCreated) ?? "-"}</TableCell>
              </TableRow>
              <TableRow>
                <TableHeader>Date Modified</TableHeader>
                <TableCell>{dateTime(t(i18n.language),_getCallLog.data.dateModified) ?? "-"}</TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <Heading3>Response body</Heading3>
          {_getCallLog.data.responseBody ? (
            <iframe className={styles.respondeBody} sandbox="" srcDoc={_getCallLog.data.responseBody}></iframe>
          ) : (
            <p>This callLog has no response body.</p>
          )}
        </div>
      )}

      {_getCallLog.isLoading && <Skeleton height="200px" />}
    </div>
  );
};

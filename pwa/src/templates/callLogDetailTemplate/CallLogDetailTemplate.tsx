import * as React from "react";
import * as styles from "./CallLogDetailTemplate.module.css";
import { Button, Heading1, Link } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from "@gemeente-denhaag/table";
import { navigate } from "gatsby";
import { useSource } from "../../hooks/source";
import { QueryClient } from "react-query";
import { Tag } from "@conduction/components";
import _ from "lodash";
import clsx from "clsx";
import { ArrowRightIcon, ArrowLeftIcon } from "@gemeente-denhaag/icons";
import { translateDate } from "../../services/dateFormat";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Skeleton from "react-loading-skeleton";

interface CallLogDetailTemplateProps {
  calllogId: string;
  sourceId: string;
}

export const CallLogDetailTemplate: React.FC<CallLogDetailTemplateProps> = ({ calllogId, sourceId }) => {
  const { t, i18n } = useTranslation();

  const queryClient = new QueryClient();
  const _useSources = useSource(queryClient);
  const _getSources = _useSources.getOne(sourceId);

  return (
    <div className={styles.container}>
      <div className={styles.backButton} onClick={() => navigate(`/sources/${sourceId}`)}>
        <Link icon={<ArrowLeftIcon />} iconAlign="start">
          {t("Back to source")}
        </Link>
      </div>
      <section className={styles.section}>
        <Heading1>{t("CallLog")}</Heading1>
        <div className={styles.buttons}>
          <Button className={styles.buttonIcon} onClick={() => navigate(`/sources/new`)}>
            <FontAwesomeIcon icon={faPlus} />
            {t("Add")}
          </Button>
        </div>
      </section>

      {_getSources.isError && "Error..."}

      {_getSources.isSuccess && (
        <div>
          <div>Id - {_getSources.data.id ?? "-"}</div>
          <div>Source - {_getSources.data.source ?? "-"}</div>
          <div>Endpoint - {_getSources.data.endpoint ?? "-"}</div>
          <div>Config - {_getSources.data.config ?? "-"}</div>
          <div>Method - {_getSources.data.method ?? "-"}</div>
          <div>Response Status - {_getSources.data.responseStatus ?? "-"}</div>
          <div>Response Status Code - {_getSources.data.responseStatusCode ?? "-"}</div>
          <div>Response Body - {_getSources.data.responseBody ?? "-"}</div>
          <div>Date Created - {_getSources.data.dateCreated ?? "-"}</div>
          <div>Date Modified - {_getSources.data.dateModified ?? "-"}</div>
        </div>
      )}

      {_getSources.isLoading && <Skeleton height="200px" />}
    </div>
  );
};

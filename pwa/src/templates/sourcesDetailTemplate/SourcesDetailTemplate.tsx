import * as React from "react";
import * as styles from "./SourcesDetailTemplate.module.css";
import {
  Alert,
  Button,
  FormField,
  FormFieldInput,
  FormFieldLabel,
  Heading1,
  Link,
} from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@gemeente-denhaag/table";
import { QueryClient } from "react-query";
import _ from "lodash";
import { useSources } from "../../hooks/sources";
import { Container, InputPassword, InputText, Tag } from "@conduction/components";
import { navigate } from "gatsby";
import { ArrowLeftIcon } from "@gemeente-denhaag/icons";
import clsx from "clsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsRotate, faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import { translateDate } from "../../services/dateFormat";
import { useForm } from "react-hook-form";
import { SourcesFormTemplate } from "../templateParts/sourcesForm/SourcesFormTemplate";

interface SourcesDetailTemplateProps {
  sourceId: string;
}

export const SourcesDetailTemplate: React.FC<SourcesDetailTemplateProps> = ({ sourceId }) => {
  const { t } = useTranslation();

  const queryClient = new QueryClient();
  const _useSources = useSources(queryClient);
  const _getSources = _useSources.getOne(sourceId);

  return (
    <Container layoutClassName={styles.container}>
      <Heading1>{t("Edit Source")}</Heading1>
      <div className={styles.backButton} onClick={() => navigate("/sources")}>
        <Link icon={<ArrowLeftIcon />} iconAlign="start">
          {t("Back to sources")}
        </Link>
      </div>

      {_getSources.isLoading && "Loading..."}
      {_getSources.isError && "Error..."}

      {_getSources.isSuccess && (
        <>
          <SourcesFormTemplate source={_getSources.data} sourceId={sourceId} />
        </>
      )}
    </Container>
  );
};

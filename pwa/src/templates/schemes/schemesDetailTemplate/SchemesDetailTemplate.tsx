import * as React from "react";
import * as styles from "./SchemesDetailTemplate.module.css";
import { useTranslation } from "react-i18next";
import { QueryClient } from "react-query";
import { Container } from "@conduction/components";
import Skeleton from "react-loading-skeleton";
import { useScheme } from "../../../hooks/scheme";
import { EditSchemesFormTemplate } from "../../templateParts/schemesForm/EditSchemesFormTemplate";

interface SchemesDetailPageProps {
  schemeId: string;
}

export const SchemesDetailTemplate: React.FC<SchemesDetailPageProps> = ({ schemeId }) => {
  const { t } = useTranslation();

  const queryClient = new QueryClient();
  const _useScheme = useScheme(queryClient);
  const getScheme = _useScheme.getOne(schemeId);

  return (
    <Container layoutClassName={styles.container}>
      {getScheme.isLoading && <Skeleton height="200px" />}
      {getScheme.isError && "Error..."}

      {getScheme.isSuccess && <EditSchemesFormTemplate scheme={getScheme.data} {...{ schemeId }} />}
    </Container>
  );
};

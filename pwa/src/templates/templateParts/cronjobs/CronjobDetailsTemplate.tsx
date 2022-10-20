import * as React from "react";
import * as styles from "./CronjobDetailsTemplate.module.css";
import { useTranslation } from "react-i18next";
import { QueryClient } from "react-query";
import { useCronjob } from "../../../hooks/cronjob";
import { Container } from "@conduction/components";
import { EditCronjobFormTemplate } from "../cronjobsForm/EditCronjobFormTemplate";
import Skeleton from "react-loading-skeleton";

interface CronjobDetailPageProps {
  cronjobId: string;
}

export const CronjobsDetailTemplate: React.FC<CronjobDetailPageProps> = ({ cronjobId }) => {
  const { t } = useTranslation();

  const queryClient = new QueryClient();
  const _useCronjob = useCronjob(queryClient);
  const getCronjob = _useCronjob.getOne(cronjobId);

  return (
    <Container layoutClassName={styles.container}>
      {getCronjob.isLoading && <Skeleton height="200px" />}
      {getCronjob.isError && "Error..."}

      {getCronjob.isSuccess && <EditCronjobFormTemplate cronjob={getCronjob.data} {...{ cronjobId }} />}
    </Container>
  );
};

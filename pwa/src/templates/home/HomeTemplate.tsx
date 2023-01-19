import * as React from "react";
import * as styles from "./HomeTemplate.module.css";
import { Heading1 } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { QueryClient } from "react-query";
import { useDashboardCards } from "../../hooks/dashboardCards";
import Skeleton from "react-loading-skeleton";
import { DashboardCard } from "../../components/dashboardCard/DashboardCard";
import _ from "lodash";
import { getPath } from "../../services/getPath";
import { Container } from "@conduction/components";

export const HomeTemplate: React.FC = () => {
  const { t } = useTranslation();

  const queryClient = new QueryClient();
  const _useDashboardCards = useDashboardCards(queryClient);
  const getDashboardCards = _useDashboardCards.getAll();

  return (
    <Container layoutClassName={styles.container}>
      <Heading1>{t("Dashboard")}</Heading1>
      {getDashboardCards.isSuccess && (
        <div className={styles.cardsGrid}>
          {getDashboardCards.data.map((dashboardCard) => (
            <DashboardCard
              title={{
                label: dashboardCard.object?.name ?? dashboardCard.object?.id,
                href: `/${getPath(dashboardCard.type)}/${dashboardCard.object?.id}`,
              }}
              type={dashboardCard.type}
              status={dashboardCard?.object?.status}
              isEnabled={dashboardCard?.object?.isEnabled}
              lastRun={dashboardCard?.object?.lastRun}
              lastCall={dashboardCard?.object?.lastCall}
            />
          ))}
        </div>
      )}
      {getDashboardCards.isLoading && <Skeleton height="200px" />}
    </Container>
  );
};

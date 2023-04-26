import * as React from "react";
import * as styles from "./HomeTemplate.module.css";
import { Heading1 } from "@gemeente-denhaag/components-react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "react-query";
import { useDashboardCards } from "../../hooks/dashboardCards";
import Skeleton from "react-loading-skeleton";
import { DashboardCard, TDashboardCardTag } from "../../components/dashboardCard/DashboardCard";
import _ from "lodash";
import { getPath } from "../../services/getPath";
import { Container } from "@conduction/components";
import { formatDateTime } from "../../services/dateTime";

export const HomeTemplate: React.FC = () => {
  const { t, i18n } = useTranslation();

  const queryClient = useQueryClient();
  const _useDashboardCards = useDashboardCards(queryClient);
  const getDashboardCards = _useDashboardCards.getAll();
  const deleteDashboardCard = _useDashboardCards.createOrDelete();

  const handleDeleteDashboardCard = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.TouchEvent<HTMLButtonElement>,
    dashboardCardId: string,
  ) => {
    e.stopPropagation();

    const confirmDeletion = confirm("Are you sure you want to delete this object?");

    if (confirmDeletion) {
      deleteDashboardCard.mutate({ id: dashboardCardId });
    }
  };

  const createTags = (dashboardCard: any): TDashboardCardTag[] => {
    const tagsArray: TDashboardCardTag[] = [];

    if (dashboardCard.object?.status) tagsArray.push({ label: dashboardCard.object.status, tooltip: "Status" });
    if (dashboardCard.object?.lastCall)
      tagsArray.push({ label: formatDateTime(t(i18n.language), dashboardCard.object.lastCall), tooltip: "Last call" });
    if (dashboardCard.object?.lastRun)
      tagsArray.push({ label: formatDateTime(t(i18n.language), dashboardCard.object.lastRun), tooltip: "Last run" });

    return tagsArray;
  };

  return (
    <Container layoutClassName={styles.container}>
      <Heading1>{t("Dashboard")}</Heading1>
      {getDashboardCards.isSuccess && (
        <div className={styles.cardsGrid}>
          {getDashboardCards.data.map((dashboardCard) => (
            <>
              {console.log(dashboardCard)}
              <DashboardCard
                key={dashboardCard.id}
                title={{
                  label: dashboardCard.object?.name ?? dashboardCard.object?.id,
                  href: `/${getPath(dashboardCard.type)}/${dashboardCard.object?.id ?? dashboardCard.entityId}`,
                }}
                tags={createTags(dashboardCard)}
                type={dashboardCard.type}
                onDelete={(e) => handleDeleteDashboardCard(e, dashboardCard.id)}
                isEnabled={dashboardCard.object?.isEnabled}
              />
            </>
          ))}
        </div>
      )}
      {getDashboardCards.isLoading && <Skeleton height="200px" />}
    </Container>
  );
};

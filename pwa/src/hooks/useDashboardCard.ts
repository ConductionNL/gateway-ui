import * as React from "react";
import { useQueryClient } from "react-query";
import { TEntity } from "../apiService/resources/dashboardCards";
import { useDashboardCards } from "./dashboardCards";

export interface useDashboardCardProps {
  name: string;
  type: string;
  entity: string;
  object: string;
  entityId: string;
  ordering: number;
}

export const useDashboardCard = () => {
  const queryClient = useQueryClient();
  const _useDashboardCards = useDashboardCards(queryClient);
  const mutateDashboardCard = _useDashboardCards.createOrDelete();

  const getDashboardCard = (id: string) => {
    const getDashboardCards = _useDashboardCards.getAll();

    const dashboardCard =
      getDashboardCards && getDashboardCards.data?.find((dashboardCards: any) => dashboardCards.entityId === id);

    return dashboardCard;
  };

  const addOrRemoveDashboardCard = (
    name: string,
    type: string,
    entity: TEntity,
    entityId: string,
    dashboardCardId: string,
  ) => {
    const data = {
      name: `dashboardCard-${name}`,
      type,
      entity: `App\\Entity\\${entity}`,
      object: "dashboardCard",
      entityId,
      ordering: 1,
    };

    mutateDashboardCard.mutate({ payload: data, id: dashboardCardId });
  };

  return { addOrRemoveDashboardCard, getDashboardCard };
};

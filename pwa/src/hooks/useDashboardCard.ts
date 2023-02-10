import * as React from "react";
import { useQueryClient } from "react-query";
import { TEntity } from "../apiService/resources/dashboardCards";
import { useDashboardCards } from "./dashboardCards";

export type TDashboardCardType =
  | "action"
  | "source"
  | "cronjob"
  | "endpoint"
  | "object"
  | "schema"
  | "collection"
  | "plugin"
  | "log"
  | "organization"
  | "user"
  | "authentication"
  | "mapping";

export interface useDashboardCardProps {
  name: string;
  type: TDashboardCardType;
  entity: string;
  object: string;
  entityId: string;
  ordering: number;
}

export const useDashboardCard = () => {
  const queryClient = useQueryClient();
  const _useDashboardCards = useDashboardCards(queryClient);
  const mutateDashboardCard = _useDashboardCards.createOrDelete();

  const [loading, setLoading] = React.useState<boolean>(false);

  const getDashboardCard = (id: string) => {
    const getDashboardCards = _useDashboardCards.getAll();

    const dashboardCard =
      getDashboardCards && getDashboardCards.data?.find((dashboardCards: any) => dashboardCards.entityId === id);

    return dashboardCard;
  };

  const toggleDashboardCard = (
    name: string,
    type: TDashboardCardType,
    entity: TEntity,
    entityId: string,
    dashboardCardId: string,
  ) => {
    setLoading(true);

    const data = {
      name: `dashboardCard-${name}`,
      type,
      entity: `App\\Entity\\${entity}`,
      object: "dashboardCard",
      entityId,
      ordering: 1,
    };

    mutateDashboardCard.mutate({ payload: data, id: dashboardCardId }, { onSettled: () => setLoading(false) });
  };

  return { toggleDashboardCard, getDashboardCard, loading };
};

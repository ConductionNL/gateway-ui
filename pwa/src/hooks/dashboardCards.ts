import * as React from "react";
import { QueryClient, useQuery } from "react-query";
import APIService from "../apiService/apiService";
import APIContext from "../apiService/apiContext";

export const useDashboardCards = (queryClient: QueryClient) => {
  const API: APIService | null = React.useContext(APIContext);

  const getAll = () =>
    useQuery<any[], Error>("dashboardCards", API.DashboardCards.getAll, {
      onError: (error) => {
        throw new Error(error.message);
      },
    });

  const getOne = (dashboardCardsId: string) =>
    useQuery<any, Error>(["dashboardCards", dashboardCardsId], () => API?.DashboardCards.getOne(dashboardCardsId), {
      initialData: () =>
        queryClient
          .getQueryData<any[]>("dashboardCards")
          ?.find((_dashboardCards) => _dashboardCards.id === dashboardCardsId),
      onError: (error) => {
        throw new Error(error.message);
      },
      enabled: !!dashboardCardsId,
    });

  return { getAll, getOne };
};

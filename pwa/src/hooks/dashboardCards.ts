import * as React from "react";
import { QueryClient, useMutation, useQuery, useQueryClient } from "react-query";
import APIService from "../apiService/apiService";
import APIContext from "../apiService/apiContext";
import { addItem, deleteItem } from "../services/mutateQueries";

export const useDashboardCards = (queryClient: QueryClient) => {
  const API: APIService | null = React.useContext(APIContext);
  const _queryClient = useQueryClient();

  const getAll = () =>
    useQuery<any[], Error>("dashboardCards", API.DashboardCards.getAll, {
      onError: (error) => {
        console.warn(error.message);
      },
      retry: 0,
    });

  const getOne = (dashboardCardsId: string) =>
    useQuery<any, Error>(["dashboardCards", dashboardCardsId], () => API?.DashboardCards.getOne(dashboardCardsId), {
      initialData: () =>
        queryClient
          .getQueryData<any[]>("dashboardCards")
          ?.find((_dashboardCards) => _dashboardCards.id === dashboardCardsId),
      onError: (error) => {
        console.warn(error.message);
      },
      enabled: !!dashboardCardsId,
    });

  const createOrDelete = (dashboardCardId?: string) =>
    useMutation<any, Error, any>(API.DashboardCards.createOrDelete, {
      onSuccess: async (newDashboardCards) => {
        if (dashboardCardId) {
          deleteItem(queryClient, "dashboardCards", newDashboardCards);
        }

        if (!dashboardCardId) {
          addItem(queryClient, "dashboardCards", newDashboardCards);
        }
      },
      onError: (error) => {
        console.warn(error.message);
      },
      onSettled: () => {
        _queryClient.resetQueries(["dashboardCards"]);
      },
    });

  return { getAll, getOne, createOrDelete };
};

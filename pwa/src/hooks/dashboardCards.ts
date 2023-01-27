import * as React from "react";
import { QueryClient, useMutation, useQuery } from "react-query";
import APIService from "../apiService/apiService";
import APIContext from "../apiService/apiContext";
import { addItem, deleteItem } from "../services/mutateQueries";
import { IsLoadingContext } from "../context/isLoading";

export const useDashboardCards = (queryClient: QueryClient) => {
  const API: APIService | null = React.useContext(APIContext);
  const [__, setIsLoading] = React.useContext(IsLoadingContext);

  const getAll = () =>
    useQuery<any[], Error>("dashboardCards", API.DashboardCards.getAll, {
      onError: (error) => {
        console.warn(error.message);
      },
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
      onMutate: () => {
        setIsLoading({ addDashboardCard: true });
      },
      onSuccess: async (newDashboardCards) => {
        if (dashboardCardId) {
          deleteItem(queryClient, "dashboardCards", newDashboardCards);
        }

        if (!dashboardCardId) {
          addItem(queryClient, "dashboardCards", newDashboardCards);
        }
      },
      onError: (error) => {
        setIsLoading({ addDashboardCard: false });

        console.warn(error.message);
      },
      onSettled: () => {
        setIsLoading({ addDashboardCard: false });
      },
    });

  return { getAll, getOne, createOrDelete };
};

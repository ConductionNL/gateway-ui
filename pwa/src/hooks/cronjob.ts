import * as React from "react";
import { QueryClient, useQuery } from "react-query";
import APIService from "../apiService/apiService";
import APIContext from "../apiService/apiContext";

export const useCronjob = (queryClient: QueryClient) => {
  const API: APIService | null = React.useContext(APIContext);

  const getAll = () =>
    useQuery<any[], Error>("cronjobs", API.Cronjob.getAll, {
      onError: (error) => {
        throw new Error(error.message);
      },
    });

  const getOne = (cronjobId: string) =>
    useQuery<any, Error>(["cronjobs", cronjobId], () => API?.Cronjob.getOne(cronjobId), {
      initialData: () => queryClient.getQueryData<any[]>("cronjobs")?.find((_action) => _action.id === cronjobId),
      onError: (error) => {
        throw new Error(error.message);
      },
      enabled: !!cronjobId,
    });

  return { getAll, getOne };
};

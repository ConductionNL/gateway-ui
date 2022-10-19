import * as React from "react";
import { QueryClient, useQuery } from "react-query";
import APIService from "../apiService/apiService";
import APIContext from "../apiService/apiContext";

export const useAction = (queryClient: QueryClient) => {
  const API: APIService | null = React.useContext(APIContext);

  const getAll = () =>
    useQuery<any[], Error>("actions", API.Action.getAll, {
      onError: (error) => {
        throw new Error(error.message);
      },
    });

  const getOne = (actionId: string) =>
    useQuery<any, Error>(["actions", actionId], () => API?.Action.getOne(actionId), {
      initialData: () => queryClient.getQueryData<any[]>("actions")?.find((_action) => _action.id === actionId),
      onError: (error) => {
        throw new Error(error.message);
      },
      enabled: !!actionId,
    });

  return { getAll, getOne };
};

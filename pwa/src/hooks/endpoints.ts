import * as React from "react";
import { QueryClient, useQuery } from "react-query";
import APIService from "../apiService/apiService";
import APIContext from "../apiService/apiContext";

export const useEndpoint = (queryClient: QueryClient) => {
  const API: APIService | null = React.useContext(APIContext);

  const getAll = () =>
    useQuery<any[], Error>("endpoints", API.Endpoints.getAll, {
      onError: (error) => {
        throw new Error(error.message);
      },
    });

  const getOne = (endpointId: string) =>
    useQuery<any, Error>(["endpoint", endpointId], () => API?.Endpoints.getOne(endpointId), {
      initialData: () => queryClient.getQueryData<any[]>("endpoint")?.find((_endpoint) => _endpoint.id === endpointId),
      onError: (error) => {
        throw new Error(error.message);
      },
      enabled: !!endpointId,
    });

  return { getAll, getOne };
};

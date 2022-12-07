import * as React from "react";
import { QueryClient, useMutation, useQuery } from "react-query";
import APIService from "../apiService/apiService";
import APIContext from "../apiService/apiContext";
import { addItem, deleteItem, updateItem } from "../services/mutateQueries";
import { navigate } from "gatsby";

export const useEndpoint = (queryClient: QueryClient) => {
  const API: APIService | null = React.useContext(APIContext);

  const getAll = (page: number) =>
    useQuery<any[], Error>(["endpoints", page], () => API.Endpoints.getAll(page), {
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

  const remove = () =>
    useMutation<any, Error, any>(API.Endpoints.delete, {
      onSuccess: async (_, variables) => {
        deleteItem(queryClient, "endpoint", variables.id);
        navigate("/endpoints");
      },
      onError: (error) => {
        throw new Error(error.message);
      },
    });

  const createOrEdit = (endpointId?: string) =>
    useMutation<any, Error, any>(API.Endpoints.createOrUpdate, {
      onSuccess: async (newEndpoints) => {
        if (endpointId) {
          updateItem(queryClient, "endpoint", newEndpoints);
          navigate("/endpoints");
        }

        if (!endpointId) {
          addItem(queryClient, "endpoint", newEndpoints);
          navigate(`/endpoints/${newEndpoints.id}`);
        }
      },
      onError: (error) => {
        throw new Error(error.message);
      },
    });

  return { getAll, getOne, remove, createOrEdit };
};

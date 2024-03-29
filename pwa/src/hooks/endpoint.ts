import * as React from "react";
import { QueryClient, useMutation, useQuery } from "react-query";
import APIService from "../apiService/apiService";
import APIContext from "../apiService/apiContext";
import { addItem, deleteItem, updateItem } from "../services/mutateQueries";
import { navigate } from "gatsby";
import { useDeletedItemsContext } from "../context/deletedItems";

export const useEndpoint = (queryClient: QueryClient) => {
  const API: APIService | null = React.useContext(APIContext);
  const { isDeleted, addDeletedItem, removeDeletedItem } = useDeletedItemsContext();

  const getAll = () =>
    useQuery<any[], Error>("endpoints", API.Endpoints.getAll, {
      onError: (error) => {
        console.warn(error.message);
      },
    });

  const getAllSelectOptions = () =>
    useQuery<any[], Error>("endpoint_select_options", API.Endpoints.getAllSelectOptions, {
      onError: (error) => {
        console.warn(error.message);
      },
    });

  const getOne = (endpointId: string) =>
    useQuery<any, Error>(["endpoint", endpointId], () => API?.Endpoints.getOne(endpointId), {
      initialData: () => queryClient.getQueryData<any[]>("endpoint")?.find((_endpoint) => _endpoint.id === endpointId),
      onError: (error) => {
        console.warn(error.message);
      },
      enabled: !!endpointId && !isDeleted(endpointId),
    });

  const remove = () =>
    useMutation<any, Error, any>(API.Endpoints.delete, {
      onMutate: ({ id }) => addDeletedItem(id),
      onSuccess: async (_, variables) => {
        deleteItem(queryClient, "endpoint", variables.id);
        navigate("/endpoints");
      },
      onError: (error, { id }) => {
        removeDeletedItem(id);
        console.warn(error.message);
      },
      onSettled: () => queryClient.invalidateQueries("endpoints"),
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
        console.warn(error.message);
      },
    });

  return { getAll, getAllSelectOptions, getOne, remove, createOrEdit };
};

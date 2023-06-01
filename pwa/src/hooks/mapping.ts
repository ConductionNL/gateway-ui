import * as React from "react";
import { QueryClient, useMutation, useQuery } from "react-query";
import APIService from "../apiService/apiService";
import APIContext from "../apiService/apiContext";
import { addItem, deleteItem, updateItem } from "../services/mutateQueries";
import { navigate } from "gatsby";
import { useDeletedItemsContext } from "../context/deletedItems";

export const useMapping = (queryClient: QueryClient) => {
  const API: APIService | null = React.useContext(APIContext);
  const { isDeleted, addDeletedItem, removeDeletedItem } = useDeletedItemsContext();

  const getAll = () =>
    useQuery<any[], Error>("mappings", API.Mapping.getAll, {
      onError: (error) => {
        console.warn(error.message);
      },
    });

  const getOne = (mappingId: string) =>
    useQuery<any, Error>(["mapping", mappingId], () => API?.Mapping.getOne(mappingId), {
      initialData: () => queryClient.getQueryData<any[]>("mapping")?.find((_mapping) => _mapping.id === mappingId),
      onError: (error) => {
        console.warn(error.message);
      },
      enabled: !!mappingId && !isDeleted(mappingId),
    });

  const remove = () =>
    useMutation<any, Error, any>(API.Mapping.delete, {
      onMutate: ({ id }) => addDeletedItem(id),
      onSuccess: async (_, variables) => {
        deleteItem(queryClient, "mappings", variables.id);
        navigate("/mappings");
      },
      onError: (error, { id }) => {
        removeDeletedItem(id);
        console.warn(error.message);
      },
    });

  const createOrEdit = (mappingId?: string) =>
    useMutation<any, Error, any>(API.Mapping.createOrUpdate, {
      onSuccess: async (newMappings) => {
        if (mappingId) {
          updateItem(queryClient, "mapping", newMappings);
        }

        if (!mappingId) {
          addItem(queryClient, "mapping", newMappings);
          navigate(`/mappings/${newMappings.id}`);
        }
      },
      onError: (error) => {
        console.warn(error.message);
      },
    });

  const testMapping = (mappingId: string) =>
    useMutation<any, Error, any>(API.Mapping.testMapping, {
      onError: (error) => {
        console.warn(error.message);
      },
    });
  return { getAll, getOne, remove, createOrEdit, testMapping };
};

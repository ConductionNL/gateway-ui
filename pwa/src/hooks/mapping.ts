import * as React from "react";
import { QueryClient, useMutation, useQuery } from "react-query";
import APIService from "../apiService/apiService";
import APIContext from "../apiService/apiContext";
import { addItem, deleteItem, updateItem } from "../services/mutateQueries";
import { navigate } from "gatsby";

export const useMapping = (queryClient: QueryClient) => {
  const API: APIService | null = React.useContext(APIContext);

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
      enabled: !!mappingId,
    });

  const remove = () =>
    useMutation<any, Error, any>(API.Mapping.delete, {
      onSuccess: async (_, variables) => {
        deleteItem(queryClient, "mapping", variables.id);
        navigate("/mappings");
      },
      onError: (error) => {
        console.warn(error.message);
      },
    });

  const createOrEdit = (mappingId?: string) =>
    useMutation<any, Error, any>(API.Mapping.createOrUpdate, {
      onSuccess: async (newMappings) => {
        if (mappingId) {
          updateItem(queryClient, "mapping", newMappings);
          navigate("/mappings");
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

  return { getAll, getOne, remove, createOrEdit };
};
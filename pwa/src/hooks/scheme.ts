import * as React from "react";
import { QueryClient, useMutation, useQuery } from "react-query";
import APIService from "../apiService/apiService";
import APIContext from "../apiService/apiContext";
import { navigate } from "gatsby";
import { addItem, deleteItem, updateItem } from "../services/mutateQueries";

export const useScheme = (queryClient: QueryClient) => {
  const API: APIService | null = React.useContext(APIContext);

  const getAll = () =>
    useQuery<any[], Error>("entities", API.Scheme.getAll, {
      onError: (error) => {
        throw new Error(error.message);
      },
    });

  const getOne = (schemeId: string) =>
    useQuery<any, Error>(["entities", schemeId], () => API?.Scheme.getOne(schemeId), {
      initialData: () => queryClient.getQueryData<any[]>("entities")?.find((_scheme) => _scheme.id === schemeId),
      onError: (error) => {
        throw new Error(error.message);
      },
      enabled: !!schemeId,
    });

  const getSchema = (schemaId: string) =>
    useQuery<any[], Error>(["schema_schema", schemaId], () => API.Scheme.getSchema(schemaId), {
      onError: (error) => {
        throw new Error(error.message);
      },
      enabled: !!schemaId,
    });

  const remove = () =>
    useMutation<any, Error, any>(API.Scheme.delete, {
      onSuccess: async (_, variables) => {
        deleteItem(queryClient, "entities", variables.id);
        navigate("/schemes");
      },
      onError: (error) => {
        throw new Error(error.message);
      },
    });

  const createOrEdit = (schemeId?: string) =>
    useMutation<any, Error, any>(API.Scheme.createOrUpdate, {
      onSuccess: async (newScheme) => {
        if (schemeId) {
          updateItem(queryClient, "entities", newScheme);
          navigate("/schemes");
        }

        if (!schemeId) {
          addItem(queryClient, "entities", newScheme);
          navigate(`/schemes/${newScheme.id}`);
        }
      },
      onError: (error) => {
        throw new Error(error.message);
      },
    });

  return { getAll, getOne, getSchema, remove, createOrEdit };
};

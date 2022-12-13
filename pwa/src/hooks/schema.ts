import * as React from "react";
import { QueryClient, useMutation, useQuery } from "react-query";
import APIService from "../apiService/apiService";
import APIContext from "../apiService/apiContext";
import { navigate } from "gatsby";
import { addItem, deleteItem, updateItem } from "../services/mutateQueries";

export const useSchema = (queryClient: QueryClient) => {
  const API: APIService | null = React.useContext(APIContext);

  const getAll = () =>
    useQuery<any[], Error>("entities", API.Schema.getAll, {
      onError: (error) => {
        throw new Error(error.message);
      },
    });

  const getOne = (schemaId: string) =>
    useQuery<any, Error>(["entities", schemaId], () => API?.Schema.getOne(schemaId), {
      initialData: () => queryClient.getQueryData<any[]>("entities")?.find((_schema) => _schema.id === schemaId),
      onError: (error) => {
        throw new Error(error.message);
      },
      enabled: !!schemaId,
    });

  const getSchema = (schemaId: string) =>
    useQuery<any[], Error>(["schema_schema", schemaId], () => API.Schema.getSchema(schemaId), {
      onError: (error) => {
        throw new Error(error.message);
      },
      enabled: !!schemaId,
    });

  const remove = () =>
    useMutation<any, Error, any>(API.Schema.delete, {
      onSuccess: async (_, variables) => {
        deleteItem(queryClient, "entities", variables.id);
        navigate("/schemas");
      },
      onError: (error) => {
        throw new Error(error.message);
      },
    });

  const createOrEdit = (schemaId?: string) =>
    useMutation<any, Error, any>(API.Schema.createOrUpdate, {
      onSuccess: async (newSchema) => {
        if (schemaId) {
          updateItem(queryClient, "entities", newSchema);
          navigate("/schemas");
        }

        if (!schemaId) {
          addItem(queryClient, "entities", newSchema);
          navigate(`/schemas/${newSchema.id}`);
        }
      },
      onError: (error) => {
        throw new Error(error.message);
      },
    });

  return { getAll, getOne, getSchema, remove, createOrEdit };
};

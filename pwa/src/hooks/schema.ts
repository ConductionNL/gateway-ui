import * as React from "react";
import { QueryClient, useMutation, useQuery } from "react-query";
import APIService from "../apiService/apiService";
import APIContext from "../apiService/apiContext";
import { navigate } from "gatsby";
import { addItem, deleteItem, updateItem } from "../services/mutateQueries";
import { useDeletedItemsContext } from "../context/deletedItems";

export const useSchema = (queryClient: QueryClient) => {
  const API: APIService | null = React.useContext(APIContext);
  const { isDeleted, addDeletedItem, removeDeletedItem } = useDeletedItemsContext();

  const getAll = () =>
    useQuery<any[], Error>("entities", API.Schema.getAll, {
      onError: (error) => {
        console.warn(error.message);
      },
    });

  const getAllSelectOptions = () =>
    useQuery<any[], Error>("entity_select_options", API.Schema.getAllSelectOptions, {
      onError: (error) => {
        console.warn(error.message);
      },
    });

  const getOne = (schemaId: string) =>
    useQuery<any, Error>(["entities", schemaId], () => API?.Schema.getOne(schemaId), {
      initialData: () => queryClient.getQueryData<any[]>("entities")?.find((_schema) => _schema.id === schemaId),
      onError: (error) => {
        console.warn(error.message);
      },
      enabled: !!schemaId && !isDeleted(schemaId),
    });

  const getSchema = (schemaId: string) =>
    useQuery<any, Error>(["schema_schema", schemaId], () => API.Schema.getSchema(schemaId), {
      onError: (error) => {
        console.warn(error.message);
      },
      enabled: !!schemaId,
    });

  const remove = () =>
    useMutation<any, Error, any>(API.Schema.delete, {
      onMutate: ({ id }) => addDeletedItem(id),
      onSuccess: async (_, variables) => {
        deleteItem(queryClient, "entities", variables.id);
        navigate("/schemas");
      },
      onError: (error, { id }) => {
        removeDeletedItem(id);
        console.warn(error.message);
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
        console.warn(error.message);
      },
    });

  return { getAll, getAllSelectOptions, getOne, getSchema, remove, createOrEdit };
};

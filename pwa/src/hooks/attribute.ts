import * as React from "react";
import { QueryClient, useMutation, useQuery } from "react-query";
import APIService from "../apiService/apiService";
import APIContext from "../apiService/apiContext";
import { addItem, deleteItem, updateItem } from "../services/mutateQueries";
import { navigate } from "gatsby";
import { useDeletedItemsContext } from "../context/deletedItems";

export const useAttribute = (queryClient: QueryClient) => {
  const API: APIService | null = React.useContext(APIContext);
  const { isDeleted, addDeletedItem, removeDeletedItem } = useDeletedItemsContext();

  const getAll = () =>
    useQuery<any[], Error>("attributes", API.Attribute.getAll, {
      onError: (error) => {
        console.warn(error.message);
      },
    });

  const getOne = (attributeId: string) =>
    useQuery<any, Error>(["attributes", attributeId], () => API?.Attribute.getOne(attributeId), {
      initialData: () =>
        queryClient.getQueryData<any[]>("attributes")?.find((_attribute) => _attribute.id === attributeId),
      onError: (error) => {
        console.warn(error.message);
      },
      enabled: !!attributeId && !isDeleted(attributeId),
    });

  const remove = (schemaId: string) =>
    useMutation<any, Error, any>(API.Attribute.delete, {
      onMutate: ({ id }) => addDeletedItem(id),
      onSuccess: async (_, variables) => {
        deleteItem(queryClient, "attributes", variables.id);
        navigate(`/schemas/${schemaId}`);
      },
      onError: (error, { id }) => {
        removeDeletedItem(id);
        console.warn(error.message);
      },
    });

  const createOrEdit = (schemaId: string, attriubteId?: string) =>
    useMutation<any, Error, any>(API.Attribute.createOrUpdate, {
      onSuccess: async (newAttribute) => {
        if (attriubteId) {
          updateItem(queryClient, "attributes", newAttribute);
          navigate(`/schemas/${schemaId}`);
        }

        if (!attriubteId) {
          addItem(queryClient, "attributes", newAttribute);
          navigate(`/schemas/${schemaId}/${newAttribute.id}`);
        }
      },
      onError: (error) => {
        console.warn(error.message);
      },
    });

  return { getAll, getOne, createOrEdit, remove };
};

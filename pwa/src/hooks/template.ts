import * as React from "react";
import { QueryClient, useMutation, useQuery } from "react-query";
import APIService from "../apiService/apiService";
import APIContext from "../apiService/apiContext";
import { navigate } from "gatsby";
import { addItem, deleteItem, updateItem } from "../services/mutateQueries";
import { useDeletedItemsContext } from "../context/deletedItems";

export const useTemplate = (queryClient: QueryClient) => {
  const API: APIService | null = React.useContext(APIContext);
  const { isDeleted, addDeletedItem, removeDeletedItem } = useDeletedItemsContext();

  const getAll = () =>
    useQuery<any[], Error>("templates", API.Template.getAll, {
      onError: (error) => {
        console.warn(error.message);
      },
    });

  const getOne = (collectionId: string) =>
    useQuery<any, Error>(["templates", collectionId], () => API?.Template.getOne(collectionId), {
      initialData: () =>
        queryClient.getQueryData<any[]>("templates")?.find((_collection) => _collection.id === collectionId),
      onError: (error) => {
        console.warn(error.message);
      },
      enabled: !!collectionId && !isDeleted(collectionId),
    });

  const remove = () =>
    useMutation<any, Error, any>(API.Template.delete, {
      onMutate: ({ id }) => addDeletedItem(id),
      onSuccess: async (_, variables) => {
        deleteItem(queryClient, "templates", variables.id);
        navigate("/templates");
      },
      onError: (error, { id }) => {
        removeDeletedItem(id);
        console.warn(error.message);
      },
    });

  const createOrEdit = (collectionId?: string) =>
    useMutation<any, Error, any>(API.Template.createOrUpdate, {
      onSuccess: async (newTemplate) => {
        if (collectionId) {
          updateItem(queryClient, "templates", newTemplate);
          navigate("/templates");
        }

        if (!collectionId) {
          addItem(queryClient, "templates", newTemplate);
          navigate(`/templates/${newTemplate.id}`);
        }
      },
      onError: (error) => {
        console.warn(error.message);
      },
    });

  return { getAll, getOne, remove, createOrEdit };
};

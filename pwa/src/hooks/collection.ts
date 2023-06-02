import * as React from "react";
import { QueryClient, useMutation, useQuery } from "react-query";
import APIService from "../apiService/apiService";
import APIContext from "../apiService/apiContext";
import { navigate } from "gatsby";
import { addItem, deleteItem, updateItem } from "../services/mutateQueries";
import { useDeletedItemsContext } from "../context/deletedItems";

export const useCollection = (queryClient: QueryClient) => {
  const API: APIService | null = React.useContext(APIContext);
  const { isDeleted, addDeletedItem, removeDeletedItem } = useDeletedItemsContext();

  const getAll = () =>
    useQuery<any[], Error>("collections", API.Collection.getAll, {
      onError: (error) => {
        console.warn(error.message);
      },
    });

  const getOne = (collectionId: string) =>
    useQuery<any, Error>(["collections", collectionId], () => API?.Collection.getOne(collectionId), {
      initialData: () =>
        queryClient.getQueryData<any[]>("collections")?.find((_collection) => _collection.id === collectionId),
      onError: (error) => {
        console.warn(error.message);
      },
      enabled: !!collectionId && !isDeleted(collectionId),
    });

  const downloadPDF = (collectionId: string) =>
    useQuery<any, Error>(["collections", collectionId], () => API.Collection.downloadPDF(collectionId), {
      onError: (error) => {
        console.warn(error.message);
      },
      enabled: !!collectionId,
    });

  const remove = () =>
    useMutation<any, Error, any>(API.Collection.delete, {
      onMutate: ({ id }) => addDeletedItem(id),
      onSuccess: async (_, variables) => {
        deleteItem(queryClient, "collections", variables.id);
        navigate("/collections");
      },
      onError: (error, { id }) => {
        removeDeletedItem(id);
        console.warn(error.message);
      },
    });

  const createOrEdit = (collectionId?: string) =>
    useMutation<any, Error, any>(API.Collection.createOrUpdate, {
      onSuccess: async (newCollection) => {
        if (collectionId) {
          updateItem(queryClient, "collections", newCollection);
          navigate("/collections");
        }

        if (!collectionId) {
          addItem(queryClient, "collections", newCollection);
          navigate(`/collections/${newCollection.id}`);
        }
      },
      onError: (error) => {
        console.warn(error.message);
      },
    });

  return { getAll, getOne, remove, createOrEdit, downloadPDF };
};

import * as React from "react";
import { QueryClient, useMutation, useQuery } from "react-query";
import APIService from "../apiService/apiService";
import APIContext from "../apiService/apiContext";
import { navigate } from "gatsby";
import { addItem, deleteItem, updateItem } from "../services/mutateQueries";

export const useCollection = (queryClient: QueryClient) => {
  const API: APIService | null = React.useContext(APIContext);

  const getAll = () =>
    useQuery<any[], Error>("collections", API.Collection.getAll, {
      onError: (error) => {
        throw new Error(error.message);
      },
    });

  const getOne = (collectionId: string) =>
    useQuery<any, Error>(["collections", collectionId], () => API?.Collection.getOne(collectionId), {
      initialData: () =>
        queryClient.getQueryData<any[]>("collections")?.find((_collection) => _collection.id === collectionId),
      onError: (error) => {
        throw new Error(error.message);
      },
      enabled: !!collectionId,
    });

  const remove = () =>
    useMutation<any, Error, any>(API.Collection.delete, {
      onSuccess: async (_, variables) => {
        deleteItem(queryClient, "collections", variables.id);
        navigate("/collections");
      },
      onError: (error) => {
        console.log(error.message);
      },
    });

  const createOrEdit = (collectionId?: string) =>
    useMutation<any, Error, any>(API.Collection.createOrUpdate, {
      onSuccess: async (newCollection) => {
        if (collectionId) {
          updateItem(queryClient, "collections", newCollection);
          navigate("/collections");
          console.log({ id: collectionId });
        }

        if (!collectionId) {
          addItem(queryClient, "collections", newCollection);
          navigate(`/collections/${newCollection.id}`);
        }
      },
      onError: (error) => {
        console.log(error.message);
      },
    });

  return { getAll, getOne, remove, createOrEdit };
};

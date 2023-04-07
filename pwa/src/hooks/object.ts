import * as React from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import APIService from "../apiService/apiService";
import APIContext from "../apiService/apiContext";
import { addItem, deleteItem, updateItem } from "../services/mutateQueries";
import { useDeletedItemsContext } from "../context/deletedItems";

export const useObject = () => {
  const API: APIService | null = React.useContext(APIContext);
  const { isDeleted, addDeletedItem, removeDeletedItem } = useDeletedItemsContext();

  const queryClient = useQueryClient();

  const getAll = (currentPage: number, limit?: number, searchQuery?: string) =>
    useQuery<any, Error>(
      ["objects", currentPage, searchQuery],
      () => API.Object.getAll(currentPage, limit, searchQuery),
      {
        onError: (error) => {
          console.warn(error.message);
        },
      },
    );

  const getOne = (objectId: string) =>
    useQuery<any, Error>(["object", objectId], () => API?.Object.getOne(objectId), {
      initialData: () => queryClient.getQueryData<any[]>("objects")?.find((_object) => _object.id === objectId),
      onError: (error) => {
        console.warn(error.message);
      },
      enabled: !!objectId && !isDeleted(objectId),
    });

  const getAllFromEntity = (entityId: string, currentPage: number, searchQuery?: string) =>
    useQuery<any, Error>(
      ["objects", entityId, currentPage, searchQuery],
      () => API.Object.getAllFromEntity(entityId, currentPage, searchQuery),
      {
        onError: (error) => {
          console.warn(error.message);
        },
        enabled: !!entityId,
      },
    );

  const getAllFromList = (list: string) =>
    useQuery<any[], Error>(["objects", list], () => API.Object.getAllFromList(list), {
      onError: (error) => {
        console.warn(error.message);
      },
      enabled: !!list,
    });

  const getSchema = (objectId: string) =>
    useQuery<any[], Error>(["object_schema", objectId], () => API.Object.getSchema(objectId), {
      onError: (error) => {
        console.warn(error.message);
      },
    });

  const remove = () =>
    useMutation<any, Error, any>(API.Object.delete, {
      onMutate: ({ id }) => addDeletedItem(id),
      onSuccess: async (_, variables) => {
        deleteItem(queryClient, "object", variables.id);
      },
      onError: (error, { id }) => {
        removeDeletedItem(id);
        console.warn(error.message);
      },
      onSettled: () => {
        setTimeout(() => queryClient.invalidateQueries(["objects"]), 100);
      },
    });

  const createOrEdit = (objectId?: string) =>
    useMutation<any, Error, any>(API.Object.createOrUpdate, {
      onSuccess: async (newObject) => {
        if (objectId) {
          updateItem(queryClient, "object", newObject);
        }

        if (!objectId) {
          addItem(queryClient, "object", newObject);
        }
      },
      onError: (error) => {
        queryClient.invalidateQueries(["object", objectId]);

        console.warn(error.message);
      },
      onSettled: () => {
        if (objectId) {
          queryClient.resetQueries(["object", objectId]);
          queryClient.resetQueries(["object_schema", objectId]);
        }
      },
    });

  return { getAll, getOne, getAllFromEntity, getAllFromList, getSchema, remove, createOrEdit };
};

import * as React from "react";
import { QueryClient, useMutation, useQuery, useQueryClient } from "react-query";
import APIService from "../apiService/apiService";
import APIContext from "../apiService/apiContext";
import { addItem, deleteItem, updateItem } from "../services/mutateQueries";
import { navigate } from "gatsby";
import { IFilters } from "../context/filters";

export const useObject = (queryClient: QueryClient) => {
  const API: APIService | null = React.useContext(APIContext);
  const _queryClient = useQueryClient();

  const getAll = (filters?: IFilters, limit?: number) =>
    useQuery<any, Error>(["objects", filters], () => API.Object.getAll(filters, limit), {
      onError: (error) => {
        throw new Error(error.message);
      },
    });

  const getOne = (objectId: string) =>
    useQuery<any, Error>(["object", objectId], () => API?.Object.getOne(objectId), {
      initialData: () => queryClient.getQueryData<any[]>("objects")?.find((_object) => _object.id === objectId),
      onError: (error) => {
        throw new Error(error.message);
      },
      enabled: !!objectId,
    });

  const getAllFromEntity = (entityId: string) =>
    useQuery<any[], Error>(["objects", entityId], () => API.Object.getAllFromEntity(entityId), {
      onError: (error) => {
        throw new Error(error.message);
      },
      enabled: !!entityId,
    });

  const getAllFromList = (list: string) =>
    useQuery<any[], Error>(["objects", list], () => API.Object.getAllFromList(list), {
      onError: (error) => {
        throw new Error(error.message);
      },
      enabled: !!list,
    });

  const getSchema = (objectId: string) =>
    useQuery<any[], Error>(["object_schema", objectId], () => API.Object.getSchema(objectId), {
      onError: (error) => {
        throw new Error(error.message);
      },
    });

  const remove = () =>
    useMutation<any, Error, any>(API.Object.delete, {
      onSuccess: async (_, variables) => {
        deleteItem(queryClient, "object", variables.id);
      },
      onError: (error) => {
        throw new Error(error.message);
      },
      onSettled: () => {
        setTimeout(() => _queryClient.invalidateQueries(["objects"]), 100);
      },
    });

  const createOrEdit = (objectId?: string) =>
    useMutation<any, Error, any>(API.Object.createOrUpdate, {
      onSuccess: async (newObject) => {
        if (objectId) {
          updateItem(queryClient, "object", newObject);
          queryClient.invalidateQueries(["objects", objectId]);
        }

        if (!objectId) {
          addItem(queryClient, "object", newObject);
        }
      },
      onError: (error) => {
        _queryClient.invalidateQueries(["object", objectId]);

        throw new Error(error.message);
      },
      onSettled: () => {
        _queryClient.invalidateQueries(["object", objectId]);
      },
    });

  return { getAll, getOne, getAllFromEntity, getAllFromList, getSchema, remove, createOrEdit };
};

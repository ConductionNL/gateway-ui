import * as React from "react";
import { QueryClient, useMutation, useQuery } from "react-query";
import APIService from "../apiService/apiService";
import APIContext from "../apiService/apiContext";
import { addItem, deleteItem, updateItem } from "../services/mutateQueries";
import { navigate } from "gatsby";

export const useObject = (queryClient: QueryClient) => {
  const API: APIService | null = React.useContext(APIContext);

  const getAll = () =>
    useQuery<any[], Error>("objects", API.Object.getAll, {
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

  const getSchema = (objectId: string) =>
    useQuery<any[], Error>(["object_schema", objectId], () => API.Object.getSchema(objectId), {
      onError: (error) => {
        throw new Error(error.message);
      },
    });

  const remove = () =>
    useMutation<any, Error, any>(API.Object.delete, {
      onSuccess: async (_, variables) => {
        navigate("/objects");
        deleteItem(queryClient, "object", variables.id);
      },
      onError: (error) => {
        throw new Error(error.message);
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
          navigate(`/objects/${newObject.id}`);
        }
      },
      onError: (error) => {
        throw new Error(error.message);
      },
    });

  return { getAll, getOne, getAllFromEntity, getSchema, remove, createOrEdit };
};

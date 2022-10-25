import * as React from "react";
import { QueryClient, useMutation, useQuery } from "react-query";
import APIService from "../apiService/apiService";
import APIContext from "../apiService/apiContext";
import { addItem, deleteItem, updateItem } from "../services/mutateQueries";
import { navigate } from "gatsby";

export const useObject = (queryClient: QueryClient) => {
  const API: APIService | null = React.useContext(APIContext);

  const getAll = () =>
    useQuery<any[], Error>("object", API.Object.getAll, {
      onError: (error) => {
        throw new Error(error.message);
      },
    });

  const getOne = (objectId: string) =>
    useQuery<any, Error>(["object", objectId], () => API?.Object.getOne(objectId), {
      initialData: () => queryClient.getQueryData<any[]>("object")?.find((_object) => _object.id === objectId),
      onError: (error) => {
        throw new Error(error.message);
      },
      enabled: !!objectId,
    });

  const remove = () =>
    useMutation<any, Error, any>(API.Object.delete, {
      onSuccess: async (_, variables) => {
        deleteItem(queryClient, "object", variables.id);
        navigate("/datalayers");
      },
      onError: (error) => {
        console.log(error.message);
      },
    });

  const createOrEdit = (objectId?: string) =>
    useMutation<any, Error, any>(API.Object.createOrUpdate, {
      onSuccess: async (newObject) => {
        if (objectId) {
          updateItem(queryClient, "object", newObject);
          navigate("/datalayers");
          console.log({ id: objectId });
        }

        if (!objectId) {
          addItem(queryClient, "object", newObject);
          navigate(`/datalayers/${newObject.id}`);
        }
      },
      onError: (error) => {
        console.log(error.message);
      },
    });

  return { getAll, getOne, remove, createOrEdit };
};

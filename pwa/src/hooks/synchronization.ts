import * as React from "react";
import { QueryClient, useMutation, useQuery, useQueryClient } from "react-query";
import APIService from "../apiService/apiService";
import APIContext from "../apiService/apiContext";
import { addItem, deleteItem, updateItem } from "../services/mutateQueries";
import { navigate } from "gatsby";
import toast from "react-hot-toast";

export const useSync = (queryClient: QueryClient) => {
  const API: APIService | null = React.useContext(APIContext);
  const _queryClient = useQueryClient();

  const getAll = () =>
    useQuery<any[], Error>("synchronizations", API.Synchroniation.getAll, {
      onError: (error) => {
        console.warn(error.message);
      },
    });

  const getOne = (syncId: string) =>
    useQuery<any, Error>(["synchronization", syncId], () => API?.Synchroniation.getOne(syncId), {
      initialData: () =>
        queryClient.getQueryData<any[]>("synchronizations")?.find((_synchronization) => _synchronization.id === syncId),
      onError: (error) => {
        console.warn(error.message);
      },
      enabled: !!syncId,
    });

  const remove = () =>
    useMutation<any, Error, any>(API.Synchroniation.delete, {
      onSuccess: async (_, variables) => {
        deleteItem(queryClient, "object", variables.id);
        _queryClient.invalidateQueries(["synchronizations"]);
      },
      onError: (error) => {
        console.warn(error.message);
      },
      onSettled: () => {
        setTimeout(() => _queryClient.invalidateQueries(["synchronizations"]), 500);
      },
    });

  const createOrEdit = (objectId: string, syncId?: string) =>
    useMutation<any, Error, any>(API.Synchroniation.createOrUpdate, {
      onSuccess: async (newSync) => {
        if (syncId) {
          toast.success("Succesfully updated synchroniation");

          updateItem(queryClient, "synchronizations", newSync);
          navigate(`/objects/${objectId}`);
        }

        if (!syncId) {
          toast.success("Succesfully created synchroniation");

          addItem(queryClient, "synchronizations", newSync);
          navigate(`/objects/${objectId}/${newSync.id}`);
        }
      },

      onError: (error) => {
        if (error.message === "Network Error") {
          toast.error("Request failed due to a Network Error");
        } else {
          toast.error(error.message);
        }

        console.warn(error.message);
      },
      onSettled: () => {},
    });

  return { getAll, getOne, remove, createOrEdit };
};

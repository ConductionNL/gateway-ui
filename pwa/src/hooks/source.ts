import * as React from "react";
import { QueryClient, useMutation, useQuery, useQueryClient } from "react-query";
import APIService from "../apiService/apiService";
import APIContext from "../apiService/apiContext";
import { addItem, deleteItem } from "../services/mutateQueries";
import { navigate } from "gatsby";
import toast from "react-hot-toast";
import { useDeletedItemsContext } from "../context/deletedItems";

export const useSource = (queryClient: QueryClient) => {
  const API: APIService | null = React.useContext(APIContext);
  const { isDeleted, addDeletedItem, removeDeletedItem } = useDeletedItemsContext();

  const getAll = () =>
    useQuery<any[], Error>("sources", API.Sources.getAll, {
      onError: (error) => {
        console.warn(error.message);
      },
    });

  const getAllSelectOptions = () =>
    useQuery<any[], Error>("source_select_options", API.Sources.getAllSelectOptions, {
      onError: (error) => {
        console.warn(error.message);
      },
    });

  const getOne = (sourceId: string) =>
    useQuery<any, Error>(["sources", sourceId], () => API?.Sources.getOne(sourceId), {
      initialData: () => queryClient.getQueryData<any[]>("sources")?.find((_sources) => _sources.id === sourceId),
      onError: (error) => {
        console.warn(error.message);
      },
      enabled: !!sourceId && !isDeleted(sourceId),
    });

  const getProxy = (sourceId?: string) =>
    useMutation<any, Error, any>(API.Sources.getProxy, {
      onSuccess: async () => {
        toast.success("Request succeeded with status code 200");
      },
      onError: (error) => {
        if (error.message === "Network Error") {
          toast.error("Request failed due to a Network Error");
        } else {
          toast.error(error.message);
        }

        queryClient.invalidateQueries(["sources", sourceId]);

        console.warn(error.message);
      },
      onSettled: () => {
        queryClient.invalidateQueries(["sources", sourceId]);
      },
    });

  const remove = () =>
    useMutation<any, Error, any>(API.Sources.delete, {
      onMutate: ({ id }) => addDeletedItem(id),
      onSuccess: async (_, variables) => {
        deleteItem(queryClient, "sources", variables.id);
        navigate("/sources");
      },
      onError: (error, { id }) => {
        removeDeletedItem(id);
        console.warn(error.message);
      },
    });

  const createOrEdit = (sourceId?: string) =>
    useMutation<any, Error, any>(API.Sources.createOrUpdate, {
      onSuccess: async (newSource) => {
        if (sourceId) {
          navigate("/sources");
        }

        if (!sourceId) {
          addItem(queryClient, "sources", newSource);
          navigate(`/sources/${newSource.id}`);
        }
      },
      onError: (error) => {
        console.warn(error.message);
      },
    });

  return { getAll, getOne, remove, createOrEdit, getProxy, getAllSelectOptions };
};

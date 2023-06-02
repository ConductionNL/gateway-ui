import * as React from "react";
import { QueryClient, useMutation, useQuery } from "react-query";
import APIService from "../apiService/apiService";
import APIContext from "../apiService/apiContext";
import { navigate } from "gatsby";
import { addItem, deleteItem, updateItem } from "../services/mutateQueries";
import { useDeletedItemsContext } from "../context/deletedItems";

export const useCronjob = (queryClient: QueryClient) => {
  const API: APIService | null = React.useContext(APIContext);
  const { isDeleted, addDeletedItem, removeDeletedItem } = useDeletedItemsContext();

  const getAll = () =>
    useQuery<any[], Error>("cronjobs", API.Cronjob.getAll, {
      onError: (error) => {
        console.warn(error.message);
      },
    });

  const getAllSelectOptions = () =>
    useQuery<any[], Error>("cronjob_select_options", API.Cronjob.getAllSelectOptions, {
      onError: (error) => {
        console.warn(error.message);
      },
    });

  const getOne = (cronjobId: string) =>
    useQuery<any, Error>(["cronjobs", cronjobId], () => API?.Cronjob.getOne(cronjobId), {
      initialData: () => queryClient.getQueryData<any[]>("cronjobs")?.find((_cronjob) => _cronjob.id === cronjobId),
      onError: (error) => {
        console.warn(error.message);
      },
      enabled: !!cronjobId && !isDeleted(cronjobId),
    });

  const downloadPDF = () =>
    useMutation<any, Error, any>(API.Cronjob.downloadPDF, {
      onError: (error) => {
        console.warn(error.message);
      },
    });

  const remove = () =>
    useMutation<any, Error, any>(API.Cronjob.delete, {
      onMutate: ({ id }) => addDeletedItem(id),
      onSuccess: async (_, variables) => {
        deleteItem(queryClient, "cronjobs", variables.id);
        navigate("/cronjobs");
      },
      onError: (error, { id }) => {
        removeDeletedItem(id);
        console.warn(error.message);
      },
    });

  const createOrEdit = (cronjobId?: string) =>
    useMutation<any, Error, any>(API.Cronjob.createOrUpdate, {
      onSuccess: async (newCronjob) => {
        if (cronjobId) {
          updateItem(queryClient, "cronjobs", newCronjob);
          navigate("/cronjobs");
        }

        if (!cronjobId) {
          addItem(queryClient, "cronjobs", newCronjob);
          navigate(`/cronjobs/${newCronjob.id}`);
        }
      },
      onError: (error) => {
        console.warn(error.message);
      },
    });

  return { getAll, getAllSelectOptions, getOne, remove, createOrEdit, downloadPDF };
};

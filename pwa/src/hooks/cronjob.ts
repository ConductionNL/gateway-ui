import * as React from "react";
import { QueryClient, useMutation, useQuery } from "react-query";
import APIService from "../apiService/apiService";
import APIContext from "../apiService/apiContext";
import { navigate } from "gatsby";
import { addItem, deleteItem, updateItem } from "../services/mutateQueries";

export const useCronjob = (queryClient: QueryClient) => {
  const API: APIService | null = React.useContext(APIContext);

  const getAll = (page: number) =>
    useQuery<any[], Error>(["cronjobs", page], () => API.Cronjob.getAll(page), {
      onError: (error) => {
        throw new Error(error.message);
      },
    });

  const getOne = (cronjobId: string) =>
    useQuery<any, Error>(["cronjobs", cronjobId], () => API?.Cronjob.getOne(cronjobId), {
      initialData: () => queryClient.getQueryData<any[]>("cronjobs")?.find((_cronjob) => _cronjob.id === cronjobId),
      onError: (error) => {
        throw new Error(error.message);
      },
      enabled: !!cronjobId,
    });

  const remove = () =>
    useMutation<any, Error, any>(API.Cronjob.delete, {
      onSuccess: async (_, variables) => {
        deleteItem(queryClient, "cronjobs", variables.id);
        navigate("/cronjobs");
      },
      onError: (error) => {
        throw new Error(error.message);
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
        throw new Error(error.message);
      },
    });

  return { getAll, getOne, remove, createOrEdit };
};

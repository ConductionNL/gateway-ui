import * as React from "react";
import { QueryClient, useMutation, useQuery } from "react-query";
import APIService from "../apiService/apiService";
import APIContext from "../apiService/apiContext";
import { addItem, deleteItem, updateItem } from "../services/mutateQueries";
import { navigate } from "gatsby";
import { useDeletedItemsContext } from "../context/deletedItems";

export const useAction = (queryClient: QueryClient) => {
  const API: APIService | null = React.useContext(APIContext);
  const { isDeleted, addDeletedItem, removeDeletedItem } = useDeletedItemsContext();

  const getAll = () =>
    useQuery<any[], Error>("actions", API.Action.getAll, {
      onError: (error) => {
        console.warn(error.message);
      },
    });

  const getAllSelectOptions = () =>
    useQuery<any[], Error>("action_select_options", API.Action.getAllSelectOptions, {
      onError: (error) => {
        console.warn(error.message);
      },
    });

  const getAllHandlers = () =>
    useQuery<any[], Error>("action_handlers", API.Action.getAllHandlers, {
      onError: (error) => {
        console.warn(error.message);
      },
    });

  const getOne = (actionId: string) =>
    useQuery<any, Error>(["actions", actionId], () => API?.Action.getOne(actionId), {
      initialData: () => queryClient.getQueryData<any[]>("actions")?.find((_action) => _action.id === actionId),
      onError: (error) => {
        console.warn(error.message);
      },
      enabled: !!actionId && !isDeleted(actionId),
    });

  const downloadPDF = () =>
    useMutation<any, Error, any>(API.Action.downloadPDF, {
      onError: (error) => {
        console.warn(error.message);
      },
    });

  const remove = () =>
    useMutation<any, Error, any>(API.Action.delete, {
      onMutate: ({ id }) => addDeletedItem(id),
      onSuccess: async (_, variables) => {
        deleteItem(queryClient, "actions", variables.id);
        navigate("/actions");
      },
      onError: (error, { id }) => {
        removeDeletedItem(id);
        console.warn(error.message);
      },
    });

  const createOrEdit = (actionId?: string) =>
    useMutation<any, Error, any>(API.Action.createOrUpdate, {
      onSuccess: async (newAction) => {
        if (actionId) {
          updateItem(queryClient, "actions", newAction);
          navigate("/actions");
        }

        if (!actionId) {
          addItem(queryClient, "actions", newAction);
          navigate(`/actions/${newAction.id}`);
        }
      },
      onError: (error) => {
        console.warn(error.message);
      },
    });

  const runAction = (actionId: string) =>
    useMutation<any, Error, any>(API.Action.runAction, {
      onError: (error) => {
        console.warn(error.message);
      },
    });

  return { getAll, getAllSelectOptions, getAllHandlers, getOne, remove, createOrEdit, runAction, downloadPDF };
};

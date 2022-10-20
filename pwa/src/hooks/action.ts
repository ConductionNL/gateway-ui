import * as React from "react";
import { QueryClient, useMutation, useQuery } from "react-query";
import APIService from "../apiService/apiService";
import APIContext from "../apiService/apiContext";
import { addItem, deleteItem, updateItem } from "../services/mutateQueries";
import { navigate } from "gatsby";

export const useAction = (queryClient: QueryClient) => {
  const API: APIService | null = React.useContext(APIContext);

  const getAll = () =>
    useQuery<any[], Error>("actions", API.Action.getAll, {
      onError: (error) => {
        throw new Error(error.message);
      },
    });

  const getOne = (actionId: string) =>
    useQuery<any, Error>(["actions", actionId], () => API?.Action.getOne(actionId), {
      initialData: () => queryClient.getQueryData<any[]>("actions")?.find((_action) => _action.id === actionId),
      onError: (error) => {
        throw new Error(error.message);
      },
      enabled: !!actionId,
    });

  const remove = () =>
    useMutation<any, Error, any>(API.Action.delete, {
      onSuccess: async (_, variables) => {
        deleteItem(queryClient, "actions", variables.id);
        navigate("/actions");
      },
      onError: (error) => {
        console.log(error.message);
      },
    });

  const createOrEdit = (actionId?: string) =>
    useMutation<any, Error, any>(API.Action.createOrUpdate, {
      onSuccess: async (newAction) => {
        if (actionId) {
          updateItem(queryClient, "actions", newAction);
          navigate("/actions");
          console.log({ id: actionId });
        }

        if (!actionId) {
          addItem(queryClient, "actions", newAction);
          navigate(`/actions/${newAction.id}`);
        }
      },
      onError: (error) => {
        console.log(error.message);
      },
    });

  return { getAll, getOne, remove, createOrEdit };
};

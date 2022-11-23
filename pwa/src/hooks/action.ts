import * as React from "react";
import { QueryClient, useMutation, useQuery } from "react-query";
import APIService from "../apiService/apiService";
import APIContext from "../apiService/apiContext";
import { addItem, deleteItem, updateItem } from "../services/mutateQueries";
import { navigate } from "gatsby";
import { AlertContext } from "../context/alert";
import { IsLoadingContext } from "../context/isLoading";

export const useAction = (queryClient: QueryClient) => {
  const API: APIService | null = React.useContext(APIContext);
  const [_, setAlert] = React.useContext(AlertContext);
  const [__, setIsLoading] = React.useContext(IsLoadingContext);

  const getAll = () =>
    useQuery<any[], Error>("actions", API.Action.getAll, {
      onError: (error) => {
        throw new Error(error.message);
      },
    });

  const getAllHandlers = () =>
    useQuery<any[], Error>("action_handlers", API.Action.getAllHandlers, {
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
    
  const getTestAction = (actionId?: string) =>
    useMutation<any, Error, any>(API.Action.getTestAction, {
      onMutate: () => {
        setIsLoading({ alert: true });
      },
      onSuccess: async () => {
        setAlert({ message: "Action succeeded with status code 200", body: "", type: "success", active: true });
      },
      onError: (error) => {
        if (error.message === "Network Error") {
          setAlert({ message: "Action failed due to a Network Error", type: "error", active: true });
        } else {
          // @ts-ignore
          setAlert({ message: error.message, body: error.response.data, type: "error", active: true });
        }
        setIsLoading({ alert: false });

        throw new Error(error.message);
      },
      onSettled: () => {
        setIsLoading({ alert: false });
    },
  });

  const remove = () =>
    useMutation<any, Error, any>(API.Action.delete, {
      onSuccess: async (_, variables) => {
        deleteItem(queryClient, "actions", variables.id);
        navigate("/actions");
      },
      onError: (error) => {
        throw new Error(error.message);
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
        throw new Error(error.message);
      },
    });

  return { getAll, getAllHandlers, getOne, remove, createOrEdit, getTestAction };
};

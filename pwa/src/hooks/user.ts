import * as React from "react";
import { QueryClient, useMutation, useQuery } from "react-query";
import APIService from "../apiService/apiService";
import APIContext from "../apiService/apiContext";
import { addItem, deleteItem, updateItem } from "../services/mutateQueries";
import { navigate } from "gatsby";

export const useUser = (queryClient: QueryClient) => {
  const API: APIService | null = React.useContext(APIContext);

  const getAll = () =>
    useQuery<any[], Error>("users", API.User.getAll, {
      onError: (error) => {
        console.warn(error.message);
      },
    });

  const getAllSelectOptions = () =>
    useQuery<any[], Error>("user_select_options", API.User.getAllSelectOptions, {
      onError: (error) => {
        console.warn(error.message);
      },
    });

  const getOne = (userId: string) =>
    useQuery<any, Error>(["users", userId], () => API?.User.getOne(userId), {
      initialData: () => queryClient.getQueryData<any[]>("users")?.find((_user) => _user.id === userId),
      onError: (error) => {
        console.warn(error.message);
      },
      enabled: !!userId,
    });

  const remove = () =>
    useMutation<any, Error, any>(API.User.delete, {
      onSuccess: async (_, variables) => {
        deleteItem(queryClient, "user", variables.id);
        navigate("/settings/users");
      },
      onError: (error) => {
        console.warn(error.message);
      },
    });

  const createOrEdit = (userId?: string) =>
    useMutation<any, Error, any>(API.User.createOrUpdate, {
      onSuccess: async (newUser) => {
        if (userId) {
          updateItem(queryClient, "users", newUser);
          navigate("/settings");
        }

        if (!userId) {
          addItem(queryClient, "users", newUser);
          navigate(`/settings/users/${newUser.id}`);
        }
      },
      onError: (error) => {
        console.warn(error.message);
      },
    });

  return { getAll, getAllSelectOptions, getOne, createOrEdit, remove };
};

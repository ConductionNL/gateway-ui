import * as React from "react";
import { QueryClient, useMutation, useQuery } from "react-query";
import APIService from "../apiService/apiService";
import APIContext from "../apiService/apiContext";
import { addItem, deleteItem, updateItem } from "../services/mutateQueries";
import { navigate } from "gatsby";
import { useDeletedItemsContext } from "../context/deletedItems";

export const useAuthentication = (queryClient: QueryClient) => {
  const API: APIService | null = React.useContext(APIContext);
  const { isDeleted, addDeletedItem, removeDeletedItem } = useDeletedItemsContext();

  const getAll = () =>
    useQuery<any[], Error>("authentications", API.Authentication.getAll, {
      onError: (error) => {
        console.warn(error.message);
      },
    });

  const getOne = (authenticationId: string) =>
    useQuery<any, Error>(["authentications", authenticationId], () => API?.Authentication.getOne(authenticationId), {
      initialData: () =>
        queryClient
          .getQueryData<any[]>("authentications")
          ?.find((_authentication) => _authentication.id === authenticationId),
      onError: (error) => {
        console.warn(error.message);
      },
      enabled: !!authenticationId && !isDeleted(authenticationId),
    });

  const remove = () =>
    useMutation<any, Error, any>(API.Authentication.delete, {
      onMutate: ({ id }) => addDeletedItem(id),
      onSuccess: async (_, variables) => {
        deleteItem(queryClient, "authentications", variables.id);
        navigate("/settings/authentication");
      },
      onError: (error, { id }) => {
        removeDeletedItem(id);
        console.warn(error.message);
      },
    });

  const createOrEdit = (authenticationId?: string) =>
    useMutation<any, Error, any>(API.Authentication.createOrUpdate, {
      onSuccess: async (newAuthentication) => {
        if (authenticationId) {
          updateItem(queryClient, "authentications", newAuthentication);
          navigate("/settings/authentication");
        }

        if (!authenticationId) {
          addItem(queryClient, "authentications", newAuthentication);
          navigate(`/settings/authentication/${newAuthentication.id}`);
        }
      },
      onError: (error) => {
        console.warn(error.message);
      },
    });

  return { getAll, getOne, createOrEdit, remove };
};

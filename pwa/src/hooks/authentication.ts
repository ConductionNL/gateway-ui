import * as React from "react";
import { QueryClient, useMutation, useQuery } from "react-query";
import APIService from "../apiService/apiService";
import APIContext from "../apiService/apiContext";
import { addItem, deleteItem, updateItem } from "../services/mutateQueries";
import { navigate } from "gatsby";

export const useAuthentication = (queryClient: QueryClient) => {
  const API: APIService | null = React.useContext(APIContext);

  const getAll = () =>
    useQuery<any[], Error>("authentications", API.Authentication.getAll, {
      onError: (error) => {
        throw new Error(error.message);
      },
    });

  const getOne = (authenticationId: string) =>
    useQuery<any, Error>(["authentications", authenticationId], () => API?.Authentication.getOne(authenticationId), {
      initialData: () =>
        queryClient
          .getQueryData<any[]>("authentications")
          ?.find((_authentication) => _authentication.id === authenticationId),
      onError: (error) => {
        throw new Error(error.message);
      },
      enabled: !!authenticationId,
    });

  const remove = (authenticationId: string) =>
    useMutation<any, Error, any>(API.Authentication.delete, {
      onSuccess: async (_, variables) => {
        deleteItem(queryClient, "authentications", variables.id);
        navigate("/settings/authentication");
      },
      onError: (error) => {
        throw new Error(error.message);
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
        throw new Error(error.message);
      },
    });

  return { getAll, getOne, createOrEdit, remove };
};

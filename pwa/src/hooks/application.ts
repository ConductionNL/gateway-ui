import * as React from "react";
import { QueryClient, useMutation, useQuery } from "react-query";
import APIService from "../apiService/apiService";
import APIContext from "../apiService/apiContext";
import { navigate } from "gatsby";
import { addItem, deleteItem, updateItem } from "../services/mutateQueries";

export const useApplication = (queryClient: QueryClient) => {
  const API: APIService | null = React.useContext(APIContext);

  const getAll = () =>
    useQuery<any[], Error>("applications", API.Application.getAll, {
      onError: (error) => {
        console.warn(error.message);
      },
    });

  const getAllSelectOptions = () =>
    useQuery<any[], Error>("application_select_options", API.Application.getAllSelectOptions, {
      onError: (error) => {
        console.warn(error.message);
      },
    });

  const getOne = (applicationId: string) =>
    useQuery<any, Error>(["applications", applicationId], () => API?.Application.getOne(applicationId), {
      initialData: () =>
        queryClient.getQueryData<any[]>("applications")?.find((_application) => _application.id === applicationId),
      onError: (error) => {
        console.warn(error.message);
      },
      enabled: !!applicationId,
    });

  const remove = () =>
    useMutation<any, Error, any>(API.Application.delete, {
      onSuccess: async (_, variables) => {
        deleteItem(queryClient, "applications", variables.id);
        navigate("/settings/applications");
      },
      onError: (error) => {
        console.warn(error.message);
      },
    });

  const createOrEdit = (applicationId?: string) =>
    useMutation<any, Error, any>(API.Application.createOrUpdate, {
      onSuccess: async (newApplication) => {
        if (applicationId) {
          updateItem(queryClient, "applications", newApplication);
          navigate("/settings/applications");
        }

        if (!applicationId) {
          addItem(queryClient, "applications", newApplication);
          navigate(`/settings/applications/${newApplication.id}`);
        }
      },
      onError: (error) => {
        console.warn(error.message);
      },
    });

  return { getAll, getAllSelectOptions, getOne, remove, createOrEdit };
};

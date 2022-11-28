import * as React from "react";
import { QueryClient, useMutation, useQuery } from "react-query";
import APIService from "../apiService/apiService";
import APIContext from "../apiService/apiContext";
import { deleteItem } from "../services/mutateQueries";
import { navigate } from "gatsby";

export const usePlugin = (queryClient: QueryClient) => {
  const API: APIService | null = React.useContext(APIContext);

  const getAllInstalled = () =>
    useQuery<any[], Error>("plugins_installed", API.Plugin.getAllInstalled, {
      onError: (error) => {
        throw new Error(error.message);
      },
    });

  const getAllAudit = () =>
    useQuery<any[], Error>("plugins_audit", API.Plugin.getAllAudit, {
      onError: (error) => {
        throw new Error(error.message);
      },
    });

  const getAllAvailable = (searchQuery: string) =>
    useQuery<any[], Error>("plugins_available", () => API.Plugin.getAllAvailable(searchQuery), {
      onError: (error) => {
        throw new Error(error.message);
      },
    });

  const getView = () =>
    useQuery<any, Error>("plugin_view", API.Plugin.getView, {
      onError: (error) => {
        throw new Error(error.message);
      },
    });

  const getOne = (pluginName: string) =>
    useQuery<any, Error>(["plugin", pluginName], () => API?.Plugin.getOne(pluginName), {
      initialData: () => queryClient.getQueryData<any[]>("plugins")?.find((_plugin) => _plugin.name === pluginName),
      onError: (error) => {
        throw new Error(error.message);
      },
      enabled: !!pluginName,
    });

  const remove = () =>
    useMutation<any, Error, any>(API.Plugin.delete, {
      onSuccess: async (_, variables) => {
        deleteItem(queryClient, "plugin", variables.id);
        navigate("/plugins");
      },
      onError: (error) => {
        throw new Error(error.message);
      },
    });

  return { getAllInstalled, getAllAudit, getAllAvailable, getView, getOne, remove };
};

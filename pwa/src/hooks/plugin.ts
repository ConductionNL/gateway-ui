import * as React from "react";
import { QueryClient, useMutation, useQuery } from "react-query";
import APIService from "../apiService/apiService";
import APIContext from "../apiService/apiContext";
import { deleteItem, updateItem } from "../services/mutateQueries";

export const usePlugin = (queryClient: QueryClient) => {
  const API: APIService | null = React.useContext(APIContext);

  const getAllInstalled = () =>
    useQuery<any[], Error>("plugins_installed", API.Plugin.getAllInstalled, {
      onError: (error) => {
        console.warn(error.message);
      },
    });

  const getAllAudit = () =>
    useQuery<any[], Error>("plugins_audit", API.Plugin.getAllAudit, {
      onError: (error) => {
        console.warn(error.message);
      },
    });

  const getAllAvailable = (searchQuery: string) =>
    useQuery<any[], Error>(["plugins_available", searchQuery], () => API.Plugin.getAllAvailable(searchQuery), {
      onError: (error) => {
        console.warn(error.message);
      },
    });

  const getView = () =>
    useQuery<any, Error>("plugin_view", API.Plugin.getView, {
      onError: (error) => {
        console.warn(error.message);
      },
    });

  const getOne = (pluginName: string) =>
    useQuery<any, Error>(["plugin", pluginName], () => API?.Plugin.getOne(pluginName), {
      initialData: () => queryClient.getQueryData<any[]>("plugins")?.find((_plugin) => _plugin.name === pluginName),
      onError: (error) => {
        console.warn(error.message);
      },
      enabled: !!pluginName,
    });

  const install = () =>
    useMutation<any, Error, any>(API.Plugin.install, {
      onSuccess: async (_, variables) => {
        updateItem(queryClient, "plugin", variables.name);
      },
      onError: (error) => {
        console.warn(error.message);
      },
    });

  const upgrade = () =>
    useMutation<any, Error, any>(API.Plugin.upgrade, {
      onSuccess: async (_, variables) => {
        updateItem(queryClient, "plugin", variables.name);
      },
      onError: (error) => {
        console.warn(error.message);
      },
    });

  const remove = () =>
    useMutation<any, Error, any>(API.Plugin.delete, {
      onSuccess: async (_, variables) => {
        deleteItem(queryClient, "plugin", variables.name);
      },
      onError: (error) => {
        console.warn(error.message);
      },
    });

  const getReadMe = (pluginRepository: string) =>
    useQuery<any, Error>(["plugin"], () => API?.PluginReadMe.getReadMe(pluginRepository), {
      onError: (error) => {
        console.warn(error.message);
      },
      enabled: !!pluginRepository,
    });

  return { getAllInstalled, getAllAudit, getAllAvailable, getView, getOne, install, remove, upgrade, getReadMe };
};

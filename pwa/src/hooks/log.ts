import * as React from "react";
import { QueryClient, useQuery } from "react-query";
import APIService from "../apiService/apiService";
import APIContext from "../apiService/apiContext";
import { ILogFiltersContext, TLogChannel } from "../context/logs";

export const useLog = (queryClient: QueryClient) => {
  const API: APIService | null = React.useContext(APIContext);

  const getOne = (logId: string) =>
    useQuery<any, Error>(["log", logId], () => API?.Log.getOne(logId), {
      initialData: () => queryClient.getQueryData<any[]>("log")?.find((_log) => _log.id === logId),
      onError: (error) => {
        console.warn(error.message);
      },
      enabled: !!logId,
    });

  const getAll = (logFilters: ILogFiltersContext, currentPage: number) =>
    useQuery<any, Error>(["log", logFilters, currentPage], () => API.Log.getAll(logFilters, currentPage), {
      onError: (error) => {
        console.warn(error.message);
      },
    });

  const getAllFromChannel = (channel: TLogChannel, resourceId: string, page: number) =>
    useQuery<any, Error>(["log", resourceId, page], () => API?.Log.getAllFromChannel(channel, resourceId, page), {
      onError: (error) => {
        console.warn(error.message);
      },
      enabled: !!resourceId,
    });

  return { getAll, getOne, getAllFromChannel };
};

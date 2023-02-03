import * as React from "react";
import { QueryClient, useQuery } from "react-query";
import APIService from "../apiService/apiService";
import APIContext from "../apiService/apiContext";
import { LogProps } from "../context/logs";
import { IPaginationFilters } from "../context/filters";

export const useLog = (queryClient: QueryClient) => {
  const API: APIService | null = React.useContext(APIContext);

  const getAll = (logFilters: LogProps, paginationFilters: IPaginationFilters) =>
    useQuery<any, Error>(
      ["log", logFilters, paginationFilters.logCurrentPage],
      () => API.Log.getAll(logFilters, paginationFilters),
      {
        onError: (error) => {
          console.warn(error.message);
        },
      },
    );

  const getOne = (logId: string) =>
    useQuery<any, Error>(["log", logId], () => API?.Log.getOne(logId), {
      initialData: () => queryClient.getQueryData<any[]>("log")?.find((_log) => _log.id === logId),
      onError: (error) => {
        console.warn(error.message);
      },
      enabled: !!logId,
    });

  return { getAll, getOne };
};

import * as React from "react";
import { QueryClient, useQuery } from "react-query";
import APIService from "../apiService/apiService";
import APIContext from "../apiService/apiContext";

export const useCallLog = (queryClient: QueryClient) => {
  const API: APIService | null = React.useContext(APIContext);

  const getAll = () =>
    useQuery<any[], Error>("callLogs", API.Log.getAll, {
      onError: (error) => {
        throw new Error(error.message);
      },
    });

  const getOne = (callLogId: string) =>
    useQuery<any, Error>(["callLogs", callLogId], () => API?.Log.getOne(callLogId), {
      initialData: () => queryClient.getQueryData<any[]>("callLogs")?.find((_callLog) => _callLog.id === callLogId),
      onError: (error) => {
        throw new Error(error.message);
      },
      enabled: !!callLogId,
    });

  return { getAll, getOne };
};

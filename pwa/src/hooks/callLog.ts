import * as React from "react";
import { QueryClient, useQuery } from "react-query";
import APIService from "../apiService/apiService";
import APIContext from "../apiService/apiContext";

export const useCallLog = (queryClient: QueryClient) => {
  const API: APIService | null = React.useContext(APIContext);

  const getAll = () =>
    useQuery<any[], Error>("callLogs", API.CallLog.getAll, {
      onError: (error) => {
        console.warn(error.message);
      },
    });

  const getOne = (callLogId: string) =>
    useQuery<any, Error>(["callLogs", callLogId], () => API?.CallLog.getOne(callLogId), {
      initialData: () => queryClient.getQueryData<any[]>("callLogs")?.find((_callLog) => _callLog.id === callLogId),
      onError: (error) => {
        console.warn(error.message);
      },
      enabled: !!callLogId,
    });

  const getSourceLog = (sourceId: string) =>
    useQuery<any, Error>(["callLogs", sourceId], () => API?.CallLog.getSourceLog(sourceId), {
      initialData: () => queryClient.getQueryData<any[]>("callLogs")?.find((_callLog) => _callLog.id === sourceId),
      onError: (error) => {
        console.warn(error.message);
      },
      enabled: !!sourceId,
    });

  return { getAll, getOne, getSourceLog };
};

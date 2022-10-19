import * as React from "react";
import { QueryClient, useQuery } from "react-query";
import APIService from "../apiService/apiService";
import APIContext from "../apiService/apiContext";

export const useObject = (queryClient: QueryClient) => {
  const API: APIService | null = React.useContext(APIContext);

  const getAll = () =>
    useQuery<any[], Error>("object", API.Object.getAll, {
      onError: (error) => {
        throw new Error(error.message);
      },
    });

  const getOne = (objectId: string) =>
    useQuery<any, Error>(["object", objectId], () => API?.Object.getOne(objectId), {
      initialData: () => queryClient.getQueryData<any[]>("object")?.find((_object) => _object.id === objectId),
      onError: (error) => {
        throw new Error(error.message);
      },
      enabled: !!objectId,
    });

  return { getAll, getOne };
};

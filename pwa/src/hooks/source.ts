import * as React from "react";
import { QueryClient, useMutation, useQuery } from "react-query";
import APIService from "../apiService/apiService";
import APIContext from "../apiService/apiContext";
import { addItem, deleteItem } from "../services/mutateQueries";
import { navigate } from "gatsby";
import { IsLoadingContext } from "../context/isLoading";
import toast from "react-hot-toast";

export const useSource = (queryClient: QueryClient) => {
  const API: APIService | null = React.useContext(APIContext);
  const [__, setIsLoading] = React.useContext(IsLoadingContext);

  const getAll = () =>
    useQuery<any[], Error>("sources", API.Sources.getAll, {
      onError: (error) => {
        throw new Error(error.message);
      },
    });

  const getOne = (sourcesId: string) =>
    useQuery<any, Error>(["sources", sourcesId], () => API?.Sources.getOne(sourcesId), {
      initialData: () => queryClient.getQueryData<any[]>("sources")?.find((_sources) => _sources.id === sourcesId),
      onError: (error) => {
        throw new Error(error.message);
      },
      enabled: !!sourcesId,
    });

  const getProxy = (sourceId?: string) =>
    useMutation<any, Error, any>(API.Sources.getProxy, {
      onMutate: () => {
        setIsLoading({ alert: true });
      },
      onSuccess: async () => {
        toast.success("Request succeeded with status code 200");
      },
      onError: (error) => {
        if (error.message === "Network Error") {
          toast.error("Request failed due to a Network Error");
        } else {
          toast.error(error.message);
        }

        setIsLoading({ alert: false });

        throw new Error(error.message);
      },
      onSettled: () => {
        setIsLoading({ alert: false });
      },
    });

  const remove = () =>
    useMutation<any, Error, any>(API.Sources.delete, {
      onSuccess: async (_, variables) => {
        deleteItem(queryClient, "gateways", variables.id);
        navigate("/sources");
      },
      onError: (error) => {
        throw new Error(error.message);
      },
    });

  const createOrEdit = (sourceId?: string) =>
    useMutation<any, Error, any>(API.Sources.createOrUpdate, {
      onSuccess: async (newSource) => {
        if (sourceId) {
          navigate("/sources");
        }

        if (!sourceId) {
          addItem(queryClient, "gateways", newSource);
          navigate(`/sources/${newSource.id}`);
        }
      },
      onError: (error) => {
        throw new Error(error.message);
      },
    });

  return { getAll, getOne, remove, createOrEdit, getProxy };
};

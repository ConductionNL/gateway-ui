import * as React from "react";
import { QueryClient, useMutation, useQuery } from "react-query";
import APIService from "../apiService/apiService";
import APIContext from "../apiService/apiContext";
import { addItem, deleteItem, updateItem } from "../services/mutateQueries";
import { navigate } from "gatsby";

export const useSource = (queryClient: QueryClient) => {
  const API: APIService | null = React.useContext(APIContext);

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

  const remove = () =>
    useMutation<any, Error, any>(API.Sources.delete, {
      onMutate: () => {
        console.log("delete mutation");
      },
      onSuccess: async (_, variables) => {
        deleteItem(queryClient, "gateways", variables.id);
        // setAlert({ message: "Deleted source", type: "success" });
        navigate("/sources");
      },
      onError: (error) => {
        console.log(error.message);

        // setAlert({ message: error.message, type: "danger" });
      },
      // onSettled: () => {
      //   setLoadingOverlay({ isLoading: false });
      // },
    });

  const createOrEdit = (sourceId?: string) =>
    useMutation<any, Error, any>(API.Sources.createOrUpdate, {
      onMutate: () => {
        console.log(sourceId);
      },
      onSuccess: async (newSource) => {
        if (sourceId) {
          // updateItem(queryClient, "gateways", newSource);
          // setAlert({ message: "Updated source", type: "success" });
          navigate("/sources");
          console.log({ id: sourceId });
        }

        if (!sourceId) {
          addItem(queryClient, "gateways", newSource);
          // setAlert({ message: "Created source", type: "success" });
          navigate(`/sources/${newSource.id}`);
          console.log(sourceId);
          console.log(newSource);
          console.log(newSource.id);
        }
      },
      onError: (error) => {
        console.log(error.message);
        // setAlert({ message: error.message, type: "danger" });
      },
      // onSettled: () => {
      //   setLoadingOverlay({ isLoading: false });
      // },
    });

  return { getAll, getOne, remove, createOrEdit };
};

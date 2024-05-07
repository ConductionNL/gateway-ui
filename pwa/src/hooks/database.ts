import * as React from "react";
import { QueryClient, useMutation, useQuery } from "react-query";
import APIService from "../apiService/apiService";
import APIContext from "../apiService/apiContext";
import { addItem, deleteItem, updateItem } from "../services/mutateQueries";
import { navigate } from "gatsby";
import { useDeletedItemsContext } from "../context/deletedItems";

export const useDatabase = (queryClient: QueryClient) => {
  const API: APIService | null = React.useContext(APIContext);
  const { isDeleted, addDeletedItem, removeDeletedItem } = useDeletedItemsContext();

  const getAll = () =>
    useQuery<any[], Error>("databases", API.Database.getAll, {
      onError: (error) => {
        console.warn(error.message);
      },
    });

  const getAllSelectOptions = () =>
    useQuery<any[], Error>("database_select_options", API.Database.getAllSelectOptions, {
      onError: (error) => {
        console.warn(error.message);
      },
    });

  const getOne = (databaseId: string) =>
    useQuery<any, Error>(["databases", databaseId], () => API?.Database.getOne(databaseId), {
      initialData: () => queryClient.getQueryData<any[]>("databases")?.find((_database) => _database.id === databaseId),
      onError: (error) => {
        console.warn(error.message);
      },
      enabled: !!databaseId && !isDeleted(databaseId),
    });

  const remove = () =>
    useMutation<any, Error, any>(API.Database.delete, {
      onMutate: ({ id }) => addDeletedItem(id),
      onSuccess: async (_, variables) => {
        deleteItem(queryClient, "database", variables.id);
        navigate("/settings/databases");
      },
      onError: (error, { id }) => {
        removeDeletedItem(id);
        console.warn(error.message);
      },
    });

  const createOrEdit = (databaseId?: string) =>
    useMutation<any, Error, any>(API.Database.createOrUpdate, {
      onSuccess: async (newDatabase) => {
        if (databaseId) {
          updateItem(queryClient, "databases", newDatabase);
          navigate("/settings");
        }

        if (!databaseId) {
          addItem(queryClient, "databases", newDatabase);
          navigate(`/settings/databases/${newDatabase.id}`);
        }
      },
      onError: (error) => {
        console.warn(error.message);
      },
    });

  return { getAll, getAllSelectOptions, getOne, createOrEdit, remove };
};

import * as React from "react";
import { QueryClient, useMutation, useQuery } from "react-query";
import APIService from "../apiService/apiService";
import APIContext from "../apiService/apiContext";
import { navigate } from "gatsby";
import { addItem, deleteItem, updateItem } from "../services/mutateQueries";
import { useDeletedItemsContext } from "../context/deletedItems";

export const useTemplate = (queryClient: QueryClient) => {
  const API: APIService | null = React.useContext(APIContext);
  const { isDeleted, addDeletedItem, removeDeletedItem } = useDeletedItemsContext();

  const getAll = () =>
    useQuery<any[], Error>("templates", API.Template.getAll, {
      onError: (error) => {
        console.warn(error.message);
      },
    });

  const getAllSelectOptions = () =>
    useQuery<any[], Error>("template_select_options", API.Template.getAllSelectOptions, {
      onError: (error) => {
        console.warn(error.message);
      },
    });

  const getOne = (templateId: string) =>
    useQuery<any, Error>(["templates", templateId], () => API?.Template.getOne(templateId), {
      initialData: () => queryClient.getQueryData<any[]>("templates")?.find((_template) => _template.id === templateId),
      onError: (error) => {
        console.warn(error.message);
      },
      enabled: !!templateId && !isDeleted(templateId),
    });

  const remove = () =>
    useMutation<any, Error, any>(API.Template.delete, {
      onMutate: ({ id }) => addDeletedItem(id),
      onSuccess: async (_, variables) => {
        deleteItem(queryClient, "templates", variables.id);
        navigate("/templates");
      },
      onError: (error, { id }) => {
        removeDeletedItem(id);
        console.warn(error.message);
      },
    });

  const createOrEdit = (templateId?: string) =>
    useMutation<any, Error, any>(API.Template.createOrUpdate, {
      onSuccess: async (newTemplate) => {
        if (templateId) {
          updateItem(queryClient, "templates", newTemplate);
          navigate("/templates");
        }

        if (!templateId) {
          addItem(queryClient, "templates", newTemplate);
          navigate(`/templates/${newTemplate.id}`);
        }
      },
      onError: (error) => {
        console.warn(error.message);
      },
    });

  return { getAll, getOne, remove, createOrEdit, getAllSelectOptions };
};

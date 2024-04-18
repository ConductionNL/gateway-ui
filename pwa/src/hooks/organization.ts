import * as React from "react";
import { QueryClient, useMutation, useQuery } from "react-query";
import APIService from "../apiService/apiService";
import APIContext from "../apiService/apiContext";
import { addItem, deleteItem, updateItem } from "../services/mutateQueries";
import { navigate } from "gatsby";
import { useDeletedItemsContext } from "../context/deletedItems";

export const useOrganization = (queryClient: QueryClient) => {
  const API: APIService | null = React.useContext(APIContext);
  const { isDeleted, addDeletedItem, removeDeletedItem } = useDeletedItemsContext();

  const getAll = () =>
    useQuery<any[], Error>("organizations", API.Organization.getAll, {
      onError: (error) => {
        console.warn(error.message);
      },
    });

  const getAllSelectOptions = () =>
    useQuery<any[], Error>("organization_select_options", API.Organization.getAllSelectOptions, {
      onError: (error) => {
        console.warn(error.message);
      },
    });

  const getOne = (organizationId: string) =>
    useQuery<any, Error>(["organizations", organizationId], () => API?.Organization.getOne(organizationId), {
      initialData: () =>
        queryClient.getQueryData<any[]>("organizations")?.find((_organization) => _organization.id === organizationId),
      onError: (error) => {
        console.warn(error.message);
      },
      enabled: !!organizationId && !isDeleted(organizationId),
    });

  const remove = () =>
    useMutation<any, Error, any>(API.Organization.delete, {
      onMutate: ({ id }) => addDeletedItem(id),
      onSuccess: async (_, variables) => {
        deleteItem(queryClient, "organizations", variables.id);
        navigate("/settings/organizations");
      },
      onError: (error, { id }) => {
        removeDeletedItem(id);
        console.warn(error.message);
      },
    });

  const createOrEdit = (organizationId?: string) =>
    useMutation<any, Error, any>(API.Organization.createOrUpdate, {
      onSuccess: async (newOrganization) => {
        if (organizationId) {
          updateItem(queryClient, "organizations", newOrganization);
          navigate("/settings");
        }

        if (!organizationId) {
          addItem(queryClient, "organizations", newOrganization);
          navigate(`/settings/organizations/${newOrganization.id}`);
        }
      },
      onError: (error) => {
        console.warn(error.message);
      },
    });

  return { getAll, getAllSelectOptions, getOne, createOrEdit, remove };
};

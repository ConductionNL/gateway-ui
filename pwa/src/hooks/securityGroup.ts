import * as React from "react";
import { QueryClient, useMutation, useQuery } from "react-query";
import APIService from "../apiService/apiService";
import APIContext from "../apiService/apiContext";
import { addItem, deleteItem, updateItem } from "../services/mutateQueries";
import { navigate } from "gatsby";
import { useDeletedItemsContext } from "../context/deletedItems";

export const useSecurityGroup = (queryClient: QueryClient) => {
  const API: APIService | null = React.useContext(APIContext);
  const { isDeleted, addDeletedItem, removeDeletedItem } = useDeletedItemsContext();

  const getAll = () =>
    useQuery<any[], Error>("securitygroups", API.SecurityGroup.getAll, {
      onError: (error) => {
        console.warn(error.message);
      },
    });

  const getOne = (securityGroupId: string) =>
    useQuery<any, Error>(["securitygroups", securityGroupId], () => API?.SecurityGroup.getOne(securityGroupId), {
      initialData: () =>
        queryClient
          .getQueryData<any[]>("securitygroups")
          ?.find((_securityGroup) => _securityGroup.id === securityGroupId),
      onError: (error) => {
        console.warn(error.message);
      },
      enabled: !!securityGroupId && !isDeleted(securityGroupId),
    });

  const remove = () =>
    useMutation<any, Error, any>(API.SecurityGroup.delete, {
      onMutate: ({ id }) => addDeletedItem(id),
      onSuccess: async (_, variables) => {
        deleteItem(queryClient, "securitygroups", variables.id);
        navigate("/settings/securitygroups");
      },
      onError: (error, { id }) => {
        removeDeletedItem(id);
        console.warn(error.message);
      },
    });

  const createOrEdit = (securityGroupId?: string) =>
    useMutation<any, Error, any>(API.SecurityGroup.createOrUpdate, {
      onSuccess: async (newSecurityGroup) => {
        if (securityGroupId) {
          updateItem(queryClient, "securitygroups", newSecurityGroup);
          navigate("/settings");
        }

        if (!securityGroupId) {
          addItem(queryClient, "securitygroups", newSecurityGroup);
          navigate(`/settings/securitygroups/${newSecurityGroup.id}`);
        }
      },
      onError: (error) => {
        console.warn(error.message);
      },
    });

  return { getAll, getOne, createOrEdit, remove };
};

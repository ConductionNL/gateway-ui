import * as React from "react";
import { QueryClient, useMutation, useQuery } from "react-query";
import APIService from "../apiService/apiService";
import APIContext from "../apiService/apiContext";
import { addItem, updateItem } from "../services/mutateQueries";
import { navigate } from "gatsby";

export const useOrganization = (queryClient: QueryClient) => {
  const API: APIService | null = React.useContext(APIContext);

  const getAll = () =>
    useQuery<any[], Error>("organizations", API.Organization.getAll, {
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
      enabled: !!organizationId,
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

  return { getAll, getOne, createOrEdit };
};

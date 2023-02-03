import * as React from "react";
import * as styles from "./LogFiltersTemplate.module.css";

import { useForm } from "react-hook-form";
import { SelectMultiple } from "@conduction/components";
import { IKeyValue } from "@conduction/components/lib/components/formFields";
import FormField, { FormFieldInput, FormFieldLabel } from "@gemeente-denhaag/form-field";
import { channels, levelNames, LogFiltersContext } from "../../../context/logs";
import { QueryClient } from "react-query";
import { useEndpoint } from "../../../hooks/endpoint";
import Skeleton from "react-loading-skeleton";
import { useSchema } from "../../../hooks/schema";
import { useCronjob } from "../../../hooks/cronjob";
import { useAction } from "../../../hooks/action";
import { useUser } from "../../../hooks/user";
import { useOrganization } from "../../../hooks/organization";
import { useApplication } from "../../../hooks/application";

export const LogFiltersTemplate: React.FC = () => {
  const [logFilters, setLogFilters] = React.useContext(LogFiltersContext);

  const queryClient = new QueryClient();

  const getEndpoints = useEndpoint(queryClient).getAll();
  const getSchemas = useSchema(queryClient).getAll();
  const getCronjobs = useCronjob(queryClient).getAll();
  const getActions = useAction(queryClient).getAll();
  const getUsers = useUser(queryClient).getAll();
  const getOrganizations = useOrganization(queryClient).getAll();
  const getApplications = useApplication(queryClient).getAll();

  const {
    register,
    control,
    watch,
    formState: { errors },
  } = useForm();

  const watchChannels = watch("channels");
  const watchLevelNames = watch("levelNames");
  const watchEndpoints = watch("endpoints");
  const watchSchemas = watch("schemas");
  const watchCronjobs = watch("cronjobs");
  const watchActions = watch("actions");
  const watchUsers = watch("users");
  const watchOrganizations = watch("organizations");
  const watchApplications = watch("applications");

  React.useEffect(() => {
    const getSelectValuesArray = (IKeyValueArray?: IKeyValue[]): any[] =>
      IKeyValueArray?.map((item) => item.value) ?? [];

    setLogFilters({
      ...logFilters,
      channels: getSelectValuesArray(watchChannels),
      levelNames: getSelectValuesArray(watchLevelNames),
      endpoints: getSelectValuesArray(watchEndpoints),
      schemas: getSelectValuesArray(watchSchemas),
      cronjobs: getSelectValuesArray(watchCronjobs),
      actions: getSelectValuesArray(watchActions),
      users: getSelectValuesArray(watchUsers),
      organizations: getSelectValuesArray(watchOrganizations),
      applications: getSelectValuesArray(watchApplications),
    });
  }, [
    watchChannels,
    watchLevelNames,
    watchEndpoints,
    watchSchemas,
    watchCronjobs,
    watchActions,
    watchUsers,
    watchOrganizations,
    watchApplications,
  ]);

  return (
    <form className={styles.form}>
      <FormField>
        <FormFieldInput>
          <FormFieldLabel>Levels</FormFieldLabel>

          <SelectMultiple
            options={levelNames.map((levelName) => ({ label: levelName, value: levelName }))}
            name="levelNames"
            {...{ register, errors, control }}
          />
        </FormFieldInput>
      </FormField>

      <FormField>
        <FormFieldInput>
          <FormFieldLabel>Channels</FormFieldLabel>

          <SelectMultiple
            options={channels.map((channel) => ({ label: channel, value: channel }))}
            name="channels"
            {...{ register, errors, control }}
          />
        </FormFieldInput>
      </FormField>

      <FormField>
        <FormFieldInput>
          <FormFieldLabel>Endpoints</FormFieldLabel>

          {getEndpoints.isSuccess && (
            <SelectMultiple
              name="endpoints"
              {...{ register, errors, control }}
              options={getEndpoints.data.map((endpoint) => ({ label: endpoint.name, value: endpoint.id }))}
            />
          )}

          {getEndpoints.isLoading && <Skeleton height="50px" />}
        </FormFieldInput>
      </FormField>

      <FormField>
        <FormFieldInput>
          <FormFieldLabel>Schemas</FormFieldLabel>

          {getSchemas.isSuccess && (
            <SelectMultiple
              name="schemas"
              {...{ register, errors, control }}
              options={getSchemas.data.map((schema) => ({ label: schema.name, value: schema.id }))}
            />
          )}

          {getSchemas.isLoading && <Skeleton height="50px" />}
        </FormFieldInput>
      </FormField>

      <FormField>
        <FormFieldInput>
          <FormFieldLabel>Cronjobs</FormFieldLabel>

          {getCronjobs.isSuccess && (
            <SelectMultiple
              name="cronjobs"
              {...{ register, errors, control }}
              options={getCronjobs.data.map((cronjob) => ({ label: cronjob.name, value: cronjob.id }))}
            />
          )}

          {getCronjobs.isLoading && <Skeleton height="50px" />}
        </FormFieldInput>
      </FormField>

      <FormField>
        <FormFieldInput>
          <FormFieldLabel>Actions</FormFieldLabel>

          {getActions.isSuccess && (
            <SelectMultiple
              name="actions"
              {...{ register, errors, control }}
              options={getActions.data.map((action) => ({ label: action.name, value: action.id }))}
            />
          )}

          {getActions.isLoading && <Skeleton height="50px" />}
        </FormFieldInput>
      </FormField>

      <FormField>
        <FormFieldInput>
          <FormFieldLabel>Users</FormFieldLabel>

          {getUsers.isSuccess && (
            <SelectMultiple
              name="users"
              {...{ register, errors, control }}
              options={getUsers.data.map((user) => ({ label: user.name, value: user.id }))}
            />
          )}

          {getUsers.isLoading && <Skeleton height="50px" />}
        </FormFieldInput>
      </FormField>

      <FormField>
        <FormFieldInput>
          <FormFieldLabel>Organizations</FormFieldLabel>

          {getOrganizations.isSuccess && (
            <SelectMultiple
              name="organizations"
              {...{ register, errors, control }}
              options={getOrganizations.data.map((organization) => ({
                label: organization.name,
                value: organization.id,
              }))}
            />
          )}

          {getOrganizations.isLoading && <Skeleton height="50px" />}
        </FormFieldInput>
      </FormField>

      <FormField>
        <FormFieldInput>
          <FormFieldLabel>Applications</FormFieldLabel>

          {getApplications.isSuccess && (
            <SelectMultiple
              name="applications"
              {...{ register, errors, control }}
              options={getApplications.data.map((application) => ({
                label: application.name,
                value: application.id,
              }))}
            />
          )}

          {getApplications.isLoading && <Skeleton height="50px" />}
        </FormFieldInput>
      </FormField>
    </form>
  );
};

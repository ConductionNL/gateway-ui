import * as React from "react";
import * as styles from "./LogFiltersTemplate.module.css";

import _ from "lodash";
import { useForm } from "react-hook-form";
import { QueryClient } from "react-query";
import Skeleton from "react-loading-skeleton";
import { useUser } from "../../../hooks/user";
import { useSchema } from "../../../hooks/schema";
import { useAction } from "../../../hooks/action";
import { useCronjob } from "../../../hooks/cronjob";
import { useEndpoint } from "../../../hooks/endpoint";
import { useApplication } from "../../../hooks/application";
import { useOrganization } from "../../../hooks/organization";
import { SelectSingle } from "@conduction/components/lib/components/formFields";
import { channels, levelNames, LogFiltersContext } from "../../../context/logs";
import FormField, { FormFieldInput, FormFieldLabel } from "@gemeente-denhaag/form-field";

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
    setLogFilters({
      ...logFilters,
      channel: watchChannels?.value,
      level_name: watchLevelNames?.value,
      context: {
        endpoint: watchEndpoints?.value,
        schema: watchSchemas?.value,
        cronjob: watchCronjobs?.value,
        action: watchActions?.value,
        user: watchUsers?.value,
        organization: watchOrganizations?.value,
        application: watchApplications?.value,
      },
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

          <SelectSingle
            isClearable
            options={levelNames.map((levelName) => ({ label: _.upperFirst(_.toLower(levelName)), value: levelName }))}
            name="levelNames"
            {...{ register, errors, control }}
          />
        </FormFieldInput>
      </FormField>

      <FormField>
        <FormFieldInput>
          <FormFieldLabel>Channels</FormFieldLabel>

          <SelectSingle
            isClearable
            options={channels.map((channel) => ({ label: _.upperFirst(channel), value: channel }))}
            name="channels"
            {...{ register, errors, control }}
          />
        </FormFieldInput>
      </FormField>

      <FormField>
        <FormFieldInput>
          <FormFieldLabel>Endpoints</FormFieldLabel>

          {getEndpoints.isSuccess && (
            <SelectSingle
              isClearable
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
            <SelectSingle
              isClearable
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
            <SelectSingle
              isClearable
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
            <SelectSingle
              isClearable
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
            <SelectSingle
              isClearable
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
            <SelectSingle
              isClearable
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
            <SelectSingle
              isClearable
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

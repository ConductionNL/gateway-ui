import * as React from "react";
import * as styles from "./LogFiltersTemplate.module.css";

import _ from "lodash";
import { useForm } from "react-hook-form";
import { useQueryClient } from "react-query";
import Skeleton from "react-loading-skeleton";
import { useUser } from "../../../hooks/user";
import { useSchema } from "../../../hooks/schema";
import { useAction } from "../../../hooks/action";
import { useCronjob } from "../../../hooks/cronjob";
import { useEndpoint } from "../../../hooks/endpoint";
import { useApplication } from "../../../hooks/application";
import { useOrganization } from "../../../hooks/organization";
import { InputText, SelectSingle } from "@conduction/components/lib/components/formFields";
import { channels, levelNames, useLogFiltersContext } from "../../../context/logs";
import FormField, { FormFieldInput, FormFieldLabel } from "@gemeente-denhaag/form-field";

export const LogFiltersTemplate: React.FC = () => {
  const { logFilters, setLogFilters } = useLogFiltersContext();

  const queryClient = useQueryClient();

  const getEndpoints = useEndpoint(queryClient).getAllSelectOptions();
  const getSchemas = useSchema(queryClient).getAllSelectOptions();
  const getCronjobs = useCronjob(queryClient).getAllSelectOptions();
  const getActions = useAction(queryClient).getAllSelectOptions();
  const getUsers = useUser(queryClient).getAllSelectOptions();
  const getOrganizations = useOrganization(queryClient).getAllSelectOptions();
  const getApplications = useApplication(queryClient).getAllSelectOptions();

  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  React.useEffect(() => {
    const subscription = watch((value) => {
      setLogFilters({
        ...logFilters,
        channel: value.channels?.value,
        level_name: value.level_name?.value,
        context: {
          session: value.session,
          process: value.process,
          endpoint: value.endpoints?.value,
          schema: value.schemas?.value,
          cronjob: value.cronjobs?.value,
          action: value.actions?.value,
          user: value.users?.value,
          organization: value.organizations?.value,
          application: value.applications?.value,
        },
      });
    });

    return () => subscription.unsubscribe();
  }, [watch]);

  React.useEffect(() => {
    setValue("session", logFilters.context?.session);

    setValue("process", logFilters.context?.process);

    setValue(
      "level_name",
      levelNameOptions.find((levelName) => levelName.value === logFilters.level_name),
    );

    setValue(
      "channels",
      channelOptions.find((channelName) => channelName.value === logFilters.channel),
    );

    setValue(
      "endpoints",
      getEndpoints.data?.find((endpoint) => endpoint.value === logFilters.context?.endpoint),
    );

    setValue(
      "schemas",
      getSchemas.data?.find((schema) => schema.value === logFilters.context?.schema),
    );

    setValue(
      "cronjobs",
      getCronjobs.data?.find((cronjob) => cronjob.value === logFilters.context?.cronjob),
    );

    setValue(
      "actions",
      getActions.data?.find((action) => action.value === logFilters.context?.action),
    );

    setValue(
      "users",
      getUsers.data?.find((user) => user.value === logFilters.context?.user),
    );

    setValue(
      "organizations",
      getOrganizations.data?.find((organization) => organization.value === logFilters.context?.organization),
    );

    setValue(
      "applications",
      getApplications.data?.find((application) => application.value === logFilters.context?.application),
    );
  }, []);

  return (
    <form className={styles.form}>
      <div className={styles.textFiltersContainer}>
        <FormField>
          <FormFieldInput>
            <FormFieldLabel>Session</FormFieldLabel>

            <InputText name="session" placeholder="Session id" {...{ register, errors }} />
          </FormFieldInput>
        </FormField>

        <FormField>
          <FormFieldInput>
            <FormFieldLabel>Process</FormFieldLabel>

            <InputText name="process" placeholder="Process id" {...{ register, errors }} />
          </FormFieldInput>
        </FormField>
      </div>

      <div className={styles.selectFiltersContainer}>
        <FormField>
          <FormFieldInput>
            <FormFieldLabel>Levels</FormFieldLabel>

            <SelectSingle isClearable options={levelNameOptions} name="level_name" {...{ register, errors, control }} />
          </FormFieldInput>
        </FormField>

        <FormField>
          <FormFieldInput>
            <FormFieldLabel>Channels</FormFieldLabel>

            <SelectSingle isClearable options={channelOptions} name="channels" {...{ register, errors, control }} />
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
                options={getEndpoints.data}
              />
            )}

            {getEndpoints.isLoading && <Skeleton height="50px" />}
          </FormFieldInput>
        </FormField>

        <FormField>
          <FormFieldInput>
            <FormFieldLabel>Schemas</FormFieldLabel>

            {getSchemas.isSuccess && (
              <SelectSingle isClearable name="schemas" {...{ register, errors, control }} options={getSchemas.data} />
            )}

            {getSchemas.isLoading && <Skeleton height="50px" />}
          </FormFieldInput>
        </FormField>

        <FormField>
          <FormFieldInput>
            <FormFieldLabel>Cronjobs</FormFieldLabel>

            {getCronjobs.isSuccess && (
              <SelectSingle isClearable name="cronjobs" {...{ register, errors, control }} options={getCronjobs.data} />
            )}

            {getCronjobs.isLoading && <Skeleton height="50px" />}
          </FormFieldInput>
        </FormField>

        <FormField>
          <FormFieldInput>
            <FormFieldLabel>Actions</FormFieldLabel>

            {getActions.isSuccess && (
              <SelectSingle isClearable name="actions" {...{ register, errors, control }} options={getActions.data} />
            )}

            {getActions.isLoading && <Skeleton height="50px" />}
          </FormFieldInput>
        </FormField>

        <FormField>
          <FormFieldInput>
            <FormFieldLabel>Users</FormFieldLabel>

            {getUsers.isSuccess && (
              <SelectSingle isClearable name="users" {...{ register, errors, control }} options={getUsers.data} />
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
                options={getOrganizations.data}
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
                options={getApplications.data}
              />
            )}

            {getApplications.isLoading && <Skeleton height="50px" />}
          </FormFieldInput>
        </FormField>
      </div>
    </form>
  );
};

const levelNameOptions = levelNames.map((levelName) => ({
  label: _.upperFirst(_.toLower(levelName)),
  value: levelName,
}));
const channelOptions = channels.map((channel) => ({ label: _.upperFirst(channel), value: channel }));

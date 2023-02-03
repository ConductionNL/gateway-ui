import * as React from "react";
import * as styles from "./LogFiltersTemplate.module.css";

import { useForm } from "react-hook-form";
import { SelectMultiple } from "@conduction/components";
import { IKeyValue } from "@conduction/components/lib/components/formFields";
import FormField, { FormFieldInput, FormFieldLabel } from "@gemeente-denhaag/form-field";
import { channels, contexts, levelNames, LogFiltersContext } from "../../../context/logs";

export const LogFiltersTemplate: React.FC = () => {
  const [logFilters, setLogFilters] = React.useContext(LogFiltersContext);

  const {
    register,
    control,
    watch,
    formState: { errors },
  } = useForm();

  const watchChannels = watch("channels");
  const watchContexts = watch("contexts");
  const watchLevelNames = watch("levelNames");

  React.useEffect(() => {
    const channels = watchChannels?.map((channel: IKeyValue) => channel.value);
    const contexts = watchContexts?.map((context: IKeyValue) => context.value);
    const levelNames = watchLevelNames?.map((levelName: IKeyValue) => levelName.value);

    setLogFilters({ ...logFilters, channels, contexts, levelNames });
  }, [watchChannels, watchContexts, watchLevelNames]);

  return (
    <form className={styles.form}>
      <FormField>
        <FormFieldInput>
          <FormFieldLabel>Level names</FormFieldLabel>

          <SelectMultiple
            options={levelNames.map((levelName) => ({ label: levelName, value: levelName }))}
            name="levelNames"
            {...{ register, errors, control }}
          />
        </FormFieldInput>
      </FormField>

      <FormField>
        <FormFieldInput>
          <FormFieldLabel>Contexts</FormFieldLabel>

          <SelectMultiple
            options={contexts.map((context) => ({ label: context, value: context }))}
            name="contexts"
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
    </form>
  );
};

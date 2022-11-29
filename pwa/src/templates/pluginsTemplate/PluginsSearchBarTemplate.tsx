import * as React from "react";
import * as styles from "./HorizontalFiltersTemplate.module.css";
import { useForm } from "react-hook-form";
import FormField, { FormFieldInput, FormFieldLabel } from "@gemeente-denhaag/form-field";
import { InputText } from "@conduction/components";
import _ from "lodash";

interface PluginsSearchBarTemplateProps {
  searchQuery: any;
  setSearchQuery: any;
}

export const PluginsSearchBarTemplate: React.FC<PluginsSearchBarTemplateProps> = ({ searchQuery, setSearchQuery }) => {
  const {
    register,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  React.useEffect(() => {
    reset({
      search: searchQuery,
    });
  }, [searchQuery]);

  React.useEffect(() => {
    const subscription = watch(({ search }) => {
      setSearchQuery(search);
    });

    return () => subscription.unsubscribe();
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <FormField>
        <FormFieldInput>
          <FormFieldLabel>Zoek op naam</FormFieldLabel>
          <InputText name="search" validation={{ required: true }} {...{ errors, register }} />
        </FormFieldInput>
      </FormField>
    </form>
  );
};

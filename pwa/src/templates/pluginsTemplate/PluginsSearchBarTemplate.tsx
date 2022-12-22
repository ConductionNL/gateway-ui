import * as React from "react";
import * as styles from "./HorizontalFiltersTemplate.module.css";
import { useForm } from "react-hook-form";
import FormField, { FormFieldInput, FormFieldLabel } from "@gemeente-denhaag/form-field";
import { InputText } from "@conduction/components";
import _ from "lodash";
import { useTranslation } from "react-i18next";

interface PluginsSearchBarTemplateProps {
  searchQuery: any;
  setSearchQuery: any;
}

export const PluginsSearchBarTemplate: React.FC<PluginsSearchBarTemplateProps> = ({ searchQuery, setSearchQuery }) => {
  const { t } = useTranslation();

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

  const SetSearchQuery = (search: string) => setSearchQuery(search)

  React.useEffect(() => {
    const subscription = watch(({ search }) => {
      SetSearchQuery(search);
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
          <FormFieldLabel>{t("Search on name")}</FormFieldLabel>
          <InputText name="search" validation={{ required: true }} {...{ errors, register }} />
        </FormFieldInput>
      </FormField>
    </form>
  );
};

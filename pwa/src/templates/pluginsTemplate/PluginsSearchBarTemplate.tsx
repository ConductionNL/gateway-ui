import * as React from "react";
import * as styles from "./HorizontalFiltersTemplate.module.css";
import { useForm } from "react-hook-form";
import FormField, { FormFieldInput, FormFieldLabel } from "@gemeente-denhaag/form-field";
import { InputText } from "@conduction/components";
import _ from "lodash";
import { useTranslation } from "react-i18next";
import { enrichValidation } from "../../services/enrichReactHookFormValidation";

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
          <FormFieldLabel>{t("Search on name")}</FormFieldLabel>
          <InputText
            name="search"
            validation={enrichValidation({ required: true })}
            {...{ errors, register }}
            ariaLabel={t("Enter search query")}
          />
        </FormFieldInput>
      </FormField>
    </form>
  );
};

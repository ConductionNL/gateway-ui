import * as React from "react";
// import * as styles from "./select.module.css";
import { Control, Controller, FieldValues } from "react-hook-form";
import ReactSelect, { ActionMeta } from "react-select";
import clsx from "clsx";

import { FieldErrors, RegisterOptions, UseFormRegister } from "react-hook-form";

export interface IReactHookFormProps {
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors;
  validation?: Omit<RegisterOptions<FieldValues, any>, "valueAsNumber" | "valueAsDate" | "setValueAs" | "disabled">;
}

const DUPLICATE_OPTION_VALUE_SPLIT = "#@)$(*&@@#$*()&"; // unique string to split values

export const getMultiSelectValues = (selected: { label: string; value: string }[], prefix?: string): string[] => {
  if (!selected) return [];

  return selected.map((option) => `${prefix ?? ""}${option.value.split(DUPLICATE_OPTION_VALUE_SPLIT)[0]}`);
};

interface ISelectProps {
  control: Control<FieldValues, any>;
  options: { label: string; value: string }[];
  name: string;
  defaultValue?: any;
  disabled?: boolean;
  isClearable?: boolean;
}

export const SelectMultiple = ({
  name,
  options,
  errors,
  control,
  validation,
  defaultValue,
  disabled,
}: ISelectProps & IReactHookFormProps): JSX.Element => {
  return (
    <Controller
      {...{ control, name, defaultValue }}
      rules={validation}
      render={({ field: { onChange: controllerOnChange, value } }) => {
        const [orderedOptions, setOrderedOptions] = React.useState<any[]>(
          options.sort((a, b) => a.label.localeCompare(b.label)),
        );
        const [selectedOptions, setSelectedOptions] = React.useState<any[]>(value ?? "");

        const handleChange = (selected: any, action: ActionMeta<any>) => {
          if (action.action === "select-option") {
            const newOptions = [
              ...orderedOptions,
              {
                label: action.option.label,
                value: `${action.option.value}${DUPLICATE_OPTION_VALUE_SPLIT}${Math.random()}`,
              },
            ];

            setOrderedOptions(newOptions.sort((a, b) => a.label.localeCompare(b.label))); // keep visible options in line
          }

          controllerOnChange(selected); // keep value in line with react-hook-form
          setSelectedOptions(selected); // set actual selected values in react-select
        };

        return (
          <ReactSelect
            value={selectedOptions}
            // className={clsx(styles.select, errors[name] && styles.error)}
            isMulti
            isDisabled={disabled}
            {...{ errors }}
            options={orderedOptions}
            menuPortalTarget={document.body}
            onChange={handleChange}
            styles={{ menuPortal: (base) => ({ ...base, zIndex: 100 }) }}
            placeholder={disabled ? "Disabled..." : "Select one or more options..."}
          />
        );
      }}
    />
  );
};

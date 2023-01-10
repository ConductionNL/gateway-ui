import * as React from "react";
import { InputText } from "@conduction/components";
import { getInputType, getSelectedOptions, getSelectOptions } from "../services";
import { TFormFromSchemaPropertyProps, TReactHookFormProps } from "../types";
import { InputURL } from "@conduction/components/lib/components/formFields";
import {
  SelectCreate,
  SelectMultiple,
  SelectSingle,
} from "@conduction/components/lib/components/formFields/select/select";
import { FormFromSchemaPropertyWrapper } from "../FormFromSchemaPropertyWrapper";

export const PropertyString: React.FC<TFormFromSchemaPropertyProps & TReactHookFormProps> = ({
  property,
  disabled,
  ...rest
}) => {
  const inputType = getInputType(property);
  const {
    required,
    maxLength,
    minLength,
    readOnly,
    placeholder,
    defaultValue,
    description,
    _propertyName: name,
  } = property;

  console.log({ inputType });

  return (
    <FormFromSchemaPropertyWrapper {...{ name, readOnly, description }}>
      {inputType.isText && (
        <InputText
          validation={{ required, maxLength, minLength }}
          disabled={disabled || readOnly}
          {...{ name, placeholder, defaultValue, ...rest }}
        />
      )}

      {inputType.isTextUrl && (
        <InputURL
          validation={{ required, maxLength, minLength }}
          disabled={disabled || readOnly}
          {...{ placeholder, name, defaultValue, ...rest }}
        />
      )}

      {inputType.isSelectMultiple && (
        <SelectMultiple
          defaultValue={getSelectedOptions(property)}
          options={getSelectOptions(property)}
          disabled={disabled || readOnly}
          {...{ placeholder, name, ...rest }}
        />
      )}

      {inputType.isSelectCreate && (
        <SelectCreate
          defaultValue={getSelectedOptions(property)}
          options={getSelectOptions(property)}
          disabled={disabled || readOnly}
          {...{ placeholder, name, ...rest }}
        />
      )}

      {inputType.isSelectSingle && (
        <SelectSingle
          defaultValue={getSelectedOptions(property)}
          options={getSelectOptions(property)}
          disabled={disabled || readOnly}
          {...{ placeholder, name, ...rest }}
        />
      )}
    </FormFromSchemaPropertyWrapper>
  );
};

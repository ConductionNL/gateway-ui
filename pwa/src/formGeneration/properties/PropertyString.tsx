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
import { validateUUID } from "../../services/validateUUID";

export const PropertyString: React.FC<TFormFromSchemaPropertyProps & TReactHookFormProps> = ({
  property,
  disabled,
  errors,
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

  return (
    <>
      {inputType.isText && (
        <InputText
          validation={{ required, maxLength, minLength }}
          disabled={disabled || readOnly}
          {...{ name, placeholder, defaultValue, errors, ...rest }}
        />
      )}

      {inputType.isTextUUID && (
        <InputText
          validation={{ required, maxLength, minLength, validate: validateUUID }}
          disabled={disabled || readOnly}
          {...{ name, placeholder, defaultValue, errors, ...rest }}
        />
      )}

      {inputType.isTextUrl && (
        <InputURL
          validation={{ required, maxLength, minLength }}
          disabled={disabled || readOnly}
          {...{ placeholder, name, defaultValue, errors, ...rest }}
        />
      )}

      {inputType.isSelectMultiple && (
        <SelectMultiple
          defaultValue={getSelectedOptions(property)}
          options={getSelectOptions(property)}
          disabled={disabled || readOnly}
          {...{ placeholder, name, errors, ...rest }}
        />
      )}

      {inputType.isSelectCreate && (
        <SelectCreate
          defaultValue={getSelectedOptions(property)}
          options={getSelectOptions(property)}
          disabled={disabled || readOnly}
          {...{ placeholder, name, errors, ...rest }}
        />
      )}

      {inputType.isSelectSingle && (
        <SelectSingle
          defaultValue={getSelectedOptions(property)}
          options={getSelectOptions(property)}
          disabled={disabled || readOnly}
          {...{ placeholder, name, errors, ...rest }}
        />
      )}
    </>
  );
};

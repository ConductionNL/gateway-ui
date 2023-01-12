import * as React from "react";
import { TFormFromSchemaPropertyProps, TReactHookFormProps } from "../types";
import { InputDateTime } from "@conduction/components/lib/components/formFields";
import { FormFromSchemaPropertyWrapper } from "../FormFromSchemaPropertyWrapper";

export const PropertyDateTime: React.FC<TFormFromSchemaPropertyProps & TReactHookFormProps> = ({
  property,
  disabled,
  errors,
  ...rest
}) => {
  const { required, readOnly, placeholder, defaultValue, description, _propertyName: name } = property;

  return (
    <FormFromSchemaPropertyWrapper {...{ name, readOnly, errors, description }}>
      <InputDateTime
        validation={{ required }}
        disabled={disabled || readOnly}
        {...{ errors, placeholder, name, defaultValue, ...rest }}
      />
    </FormFromSchemaPropertyWrapper>
  );
};

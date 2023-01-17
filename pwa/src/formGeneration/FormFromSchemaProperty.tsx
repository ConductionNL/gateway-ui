import * as React from "react";
import { FormFromSchemaPropertyWrapper } from "./FormFromSchemaPropertyWrapper";
import { PropertyDate, PropertyDateTime, PropertyString } from "./properties";
import { TFormFromSchemaPropertyProps, TPropertyType, TReactHookFormProps } from "./types";

export const FormFromSchemaProperty: React.FC<TFormFromSchemaPropertyProps & TReactHookFormProps> = ({
  property,
  errors,
  ...rest
}) => {
  const { _propertyName: name, readOnly, description } = property;

  console.log({ property });

  return (
    <FormFromSchemaPropertyWrapper {...{ name, readOnly, errors, description }}>
      <PropertyType {...{ property, errors, ...rest }} />
    </FormFromSchemaPropertyWrapper>
  );
};

const PropertyType: React.FC<TFormFromSchemaPropertyProps & TReactHookFormProps> = ({ property, ...rest }) => {
  switch (property.type as TPropertyType) {
    case "string":
      return <PropertyString {...{ property, ...rest }} />;
    case "date":
      return <PropertyDate {...{ property, ...rest }} />;
    case "datetime":
      return <PropertyDateTime {...{ property, ...rest }} />;
  }

  return <></>; // IDE claims this will never be reached, Gatsby disagrees
};

import * as React from "react";
import { PropertyDate, PropertyString } from "./properties";
import { TFormFromSchemaPropertyProps, TPropertyType, TReactHookFormProps } from "./types";

export const FormFromSchemaProperty: React.FC<TFormFromSchemaPropertyProps & TReactHookFormProps> = ({
  property,
  ...rest
}) => {
  const propertyType = property.type as TPropertyType;

  switch (propertyType) {
    case "string":
      return <PropertyString {...{ property, ...rest }} />;
    case "date":
      return <PropertyDate {...{ property, ...rest }} />;
  }

  return <></>; // IDE claims this will never be reached, Gatsby disagrees
};

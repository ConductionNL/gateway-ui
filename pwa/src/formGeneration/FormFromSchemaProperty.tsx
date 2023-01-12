import * as React from "react";
import { PropertyString } from "./properties/PropertyString";
import { TFormFromSchemaPropertyProps, TPropertyType, TReactHookFormProps } from "./types";

export const FormFromSchemaProperty: React.FC<TFormFromSchemaPropertyProps & TReactHookFormProps> = ({
  property,
  ...rest
}) => {
  const propertyType = property.type as TPropertyType;

  switch (propertyType) {
    case "string":
      return <PropertyString {...{ property, ...rest }} />;
  }

  return <></>; // IDE claims this will never be reached, that's not true
};

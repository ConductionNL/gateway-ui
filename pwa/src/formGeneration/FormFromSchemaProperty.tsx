import * as React from "react";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import FormField, { FormFieldInput, FormFieldLabel } from "@gemeente-denhaag/form-field";
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

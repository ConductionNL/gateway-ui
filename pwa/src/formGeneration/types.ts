import { FieldValues, UseFormRegister } from "react-hook-form";

export type TReactHookFormProps = {
  register: UseFormRegister<FieldValues>;
  errors: { [x: string]: any };
  control: any; // todo: type this
};

export type SelectOption = {
  label: string;
  value: string;
};

export type TInputType = {
  isText?: boolean;
  isTextUrl?: boolean;
  isSelectCreate?: boolean;
  isSelectSingle?: boolean;
  isSelectMultiple?: boolean;
};

// used to determine what TInputType should be set, based on the property
export type TInputTypeVariables = {
  type: TPropertyType;
  format: TPropertyFormat;
  enumOptions: any;
  multiple: boolean;
};

export type TPropertyType = "string";

export type TPropertyFormat = "countryCode" | "bsn" | "url" | "uri" | "uuid" | "email" | "phone" | "json" | "ducth_pc4";

export type TFormFromSchemaPropertyProps = {
  property: any;
  disabled: boolean;
};

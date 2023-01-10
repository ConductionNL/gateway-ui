import { SelectOption, TInputType, TInputTypeVariables, TPropertyFormat, TPropertyType } from "./types";

export const getInputType = (property: any): TInputType => {
  let inputType = {} as TInputType;

  const type = property.type as TPropertyType;
  const format = property.format as TPropertyFormat;
  const enumOptions = property.enum;
  const multiple = property.multiple as boolean;

  switch (type) {
    case "string":
      inputType = setStringTypes({ ...{ type, format, enumOptions, multiple } }, inputType);
      break;
  }

  return inputType;
};

const setStringTypes = (vars: TInputTypeVariables, inputType: TInputType): TInputType => {
  return {
    ...inputType,
    isText: !vars.enumOptions && !vars.multiple && !(vars.format === "url"),
    isTextUrl: !vars.enumOptions && !vars.multiple && vars.format === "url",
    isSelectCreate: !vars.enumOptions && vars.multiple,
    isSelectSingle: vars.enumOptions && !vars.multiple,
    isSelectMultiple: vars.enumOptions && vars.multiple,
  };
};

export const getSelectOptions = (property: any): SelectOption[] => {
  const value = property.value;
  const multiple = property.multiple;
  const enumOptions = property.enum;

  const mappedEnumOptions = enumOptions?.map((e: any) => ({ label: e.key, value: e.value })) ?? [];

  // dit gaat nog fout! http://localhost:8000/objects/175c2d37-444f-47a3-a78e-4a70d9cc860c
  let mappedValueOptions;

  if (multiple) mappedValueOptions = value?.map((v: any) => ({ label: v, value: v })) ?? [];
  if (!multiple) mappedValueOptions = { label: value, value: value };

  return [...mappedEnumOptions, ...mappedValueOptions];
};

export const getSelectedOptions = (property: any): SelectOption | SelectOption[] | null => {
  const value = property.value;
  const multiple = property.multiple;

  if (!value) return null;

  if (!multiple) return { label: value, value: value };

  return value?.map((v: any) => ({ label: v, value: v }));
};

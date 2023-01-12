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
    isText: !vars.enumOptions && !vars.multiple && !vars.format,
    isTextUrl: !vars.enumOptions && !vars.multiple && vars.format === "url",
    isTextUUID: !vars.enumOptions && !vars.multiple && vars.format === "uuid",
    isSelectCreate: !vars.enumOptions && vars.multiple,
    isSelectSingle: vars.enumOptions && !vars.multiple,
    isSelectMultiple: vars.enumOptions && vars.multiple,
  };
};

export const getSelectOptions = (property: any): SelectOption[] => {
  if (!property.value && !property.enum) return [];

  let mappedEnumOptions = [];
  let mappedValueOptions = [];

  if (property.enum && property.enum !== "undefined") {
    mappedEnumOptions = property.enum.map((e: any) => ({ label: e, value: e }));
  }

  if (property.value) {
    if (Array.isArray(property.value)) {
      mappedValueOptions = property.value.map((v: any) => ({ label: v, value: v }));
    } else {
      mappedValueOptions.push({ label: property.value, value: property.value });
    }
  }

  const uniqueOptions = [
    ...new Map([...mappedEnumOptions, ...mappedValueOptions].map((option: any) => [option.value, option])).values(),
  ];

  return uniqueOptions;
};

export const getSelectedOptions = (property: any): SelectOption | SelectOption[] | null => {
  const value = property.value;
  const multiple = property.multiple;

  if (!value) return null;

  if (!multiple) return { label: value, value: value };

  return value?.map((v: any) => ({ label: v, value: v }));
};

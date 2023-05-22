// Temporary; the InputSelect elements should return data that the gateway expects

import { getMultiSelectValues } from "../components/multiSelect/MultiSelect";

export const mapSelectInputFormData = (data: any) => {
  const mappedData = data;

  for (const [key, _value] of Object.entries(data)) {
    const value = _value as any;

    if (value === null) {
      continue;
    }

    if (typeof value === "object") {
      data[key] = value.value; // SelectSingle
    }

    if (Array.isArray(value)) {
      data[key] = getMultiSelectValues(value); // value.map((item: any) => item.value); // SelectMultiple or SelectCreate
    }
  }

  return mappedData;
};

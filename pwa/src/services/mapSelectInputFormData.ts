// Temporary; the InputSelect elements should return data that the gateway expects

export const mapSelectInputFormData = (data: any) => {
  const mappedData = data;

  for (const [key, _value] of Object.entries(data)) {
    const value = _value as any;

    if (typeof value === "object") {
      data[key] = value.value; // SelectSingle
    }

    if (Array.isArray(value)) {
      data[key] = value.map((item: any) => item.value); // SelectMultiple or SelectCreate
    }
  }

  return mappedData;
};

export const mapSelectInputFormDataObject = (data: any) => {
  const mappedData = data;

  for (const [key, _value] of Object.entries(data)) {
    const value = _value as any;

    if (typeof value === "object") {
      data[key] = `App\\Enity\\${value.value}`; // SelectSingle
    }

    if (Array.isArray(value)) {
      data[key] = value.map((item: any) => `App\\Enity\\${item.value}`); // SelectMultiple or SelectCreate
    }
  }

  return mappedData;
};

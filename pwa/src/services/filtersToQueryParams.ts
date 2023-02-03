export const filtersToQueryParams = (filters: any): string => {
  Object.keys(filters)
    .filter((key) => filterKeysToRemove.includes(key))
    .forEach((key) => {
      delete filters[key];
    });

  let params: string = "";

  for (const [key, value] of Object.entries(filters)) {
    if (!value) continue;

    if (typeof value === "string") {
      params += `&${key}=${value}`;
    }

    if (Array.isArray(value)) {
      let arrayParams = "";

      value.forEach((value) => {
        arrayParams += `&${key}[]=${value}`;
      });

      params += arrayParams;
    }

    if (typeof value === "object") {
      for (const [_key, _value] of Object.entries(value)) {
        if (!_value) continue;

        params += `&${key}.${_key}=${_value}`;
      }
    }
  }

  return params;
};

const filterKeysToRemove: string[] = []; // optional array of keys to skip when creating params

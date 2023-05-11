export const filtersToQueryParams = (filters: any): string => {
  Object.keys(filters)
    .filter((key) => filterKeysToRemove.includes(key))
    .forEach((key) => {
      delete filters[key];
    });

  let params: string = "";

  for (const [key, value] of Object.entries(filters)) {
    console.log("main value", value);
    if (!value) continue;

    if (typeof value === "string") {
      params += `&${key}=${value}`;
    } else if (Array.isArray(value)) {
      let arrayParams = "";

      console.log("array", value);

      value.forEach((value) => {
        arrayParams += `&${key}[]=${value}`;
      });

      params += arrayParams;
    } else if (typeof value === "object") {
      for (const [_key, _value] of Object.entries(value)) {
        if (!_value) continue;

        console.log("object", value);

        params += `&${key}.${_key}=${_value}`;
      }
    }
  }

  return params;
};

const filterKeysToRemove: string[] = []; // optional array of keys to skip when creating params

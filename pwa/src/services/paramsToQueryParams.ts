export const paramsToQueryParams = (params: any, hasFirstParam?: boolean): string => {
  let queryParams: string = "";

  let firstParam: boolean = true;

  for (const [key, value] of Object.entries(params)) {
    if (!value) continue;

    if (hasFirstParam) {
      if (firstParam) {
        if (typeof value === "string") {
          queryParams += `?${key}=${value}`;
        }

        if (Array.isArray(value)) {
          let arrayQueryParams = "";

          value.forEach((value, index) => {
            if (index == 0) {
              arrayQueryParams += `?${key}[]=${value}`;
            } else {
              arrayQueryParams += `&${key}[]=${value}`;
            }
          });

          queryParams += arrayQueryParams;
        }
        firstParam = false;
      } else {
        if (typeof value === "string") {
          queryParams += `&${key}=${value}`;
        }

        if (Array.isArray(value)) {
          let arrayQueryParams = "";

          value.forEach((value) => {
            arrayQueryParams += `&${key}[]=${value}`;
          });

          queryParams += arrayQueryParams;
        }
      }
    } else {
      if (typeof value === "string") {
        queryParams += `&${key}=${value}`;
      }

      if (Array.isArray(value)) {
        let arrayQueryParams = "";

        value.forEach((value) => {
          arrayQueryParams += `&${key}[]=${value}`;
        });

        queryParams += arrayQueryParams;
      }
    }
  }

  return queryParams;
};

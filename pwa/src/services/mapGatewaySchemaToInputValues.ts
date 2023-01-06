export const mapGatewaySchemaToInputValues = (value: any): any => {
  switch (value.type) {
    case "array":
      if (Array.isArray(value.value) || value.value === undefined) {
        return value.value?.map((item: any) => ({ key: item.key, value: item.value }));
      } else {
        const objectToArray = Object.entries(value.value).map(([key, value]) => ({ key, value: value }));
        return objectToArray?.map((item: any) => ({ key: item.key, value: item.value }));
      }

    case "boolean":
    case "integer":
    case "date":
    case "number":
      return value.value;

    case "datetime":
      return value.value?.substring(0, 16);

    case "string":
      if (value.enum && !value.multiple) {
        const options = value.enum.map((e: any) => ({ label: e, value: e }));
        let defaultValue: any = [];

        if (value.value && value.value !== "undefined") {
          defaultValue = options.find((option: any) => option.value === value.value);
        }

        return { options, defaultValue };
      }

      if (value.enum && value.multiple) {
        const options = value.enum.map((e: any) => ({ label: e, value: e }));

        const defaultValue = value.value?.map((v: any) => ({ label: v, value: v }));

        return { options, defaultValue };
      }

      if (value.multiple && !value.enum) {
        return value.value?.map((v: any) => ({ label: v, value: v })) ?? [];
      }

      return value.value;

    case "object":
      if (value.enum && value.multiple) {
        const options = value.enum.map((e: any) => ({ label: e, value: e }));

        const defaultValue = value.value?.map((v: any) => ({ label: v, value: v }));

        return { options, defaultValue };
      }
  }
};

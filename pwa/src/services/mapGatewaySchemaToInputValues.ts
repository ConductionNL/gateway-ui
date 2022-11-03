export const mapGatewaySchemaToInputValues = (value: any): any => {
  switch (value.type) {
    case "array":
      let values = [];

      if (value.value) {
        for (const [key, _value] of Object.entries(value.value)) {
          values.push({ key, value: _value });
        }
      }

      return values;

    case "boolean":
    case "integer":
    case "date":
    case "number":
      return value.value;

    case "string":
      if (value.enum && !value.multiple) {
        const options = value.enum.map((e: any) => ({ label: e, value: e }));
        const defaultValue =
          value.value && value.value !== "undefined"
            ? JSON.parse(value.value).map((dF: any) => ({ label: dF, value: dF }))
            : [];

        return { options, defaultValue };
      }

      if (value.enum && value.multiple) {
        console.log({ value });
        const options = value.enum.map((e: any) => ({ label: e, value: e }));

        const defaultValue = value.value?.map((v: any) => ({ label: v, value: v }));

        return { options, defaultValue };
      }

      if (value.multiple && !value.enum) {
        return value.value?.map((v: any) => ({ label: v, value: v })) ?? [];
      }

      return value.value;
  }
};

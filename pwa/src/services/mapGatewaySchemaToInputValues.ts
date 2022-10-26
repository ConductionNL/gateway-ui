import { SchemaInputType } from "../templates/templateParts/generatedSchemaForm/GeneratedSchemaFormTemplate";

export const mapGatewaySchemaToInputValues = (type: SchemaInputType, schemaValues?: any): any => {
  if (!schemaValues) return;

  switch (type) {
    case "array":
      let values = [];

      for (const [key, value] of Object.entries(schemaValues)) {
        values.push({ label: key, value });
      }

      return values;

    case "boolean":
    case "string":
      return schemaValues;
  }
};
